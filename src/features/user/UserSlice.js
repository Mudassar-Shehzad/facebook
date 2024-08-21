import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, signInWithEmailAndPassword, updateCurrentUser } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { getFirestore, doc, setDoc, collection, getDocs, query, where, updateDoc, addDoc, Firestore, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";

const db = getFirestore();




// export  const showUserProfile = async () => {
//     try {
//         const userCollections = collection(db, 'users');
//         const userSnapShot = await getDocs(userCollections)

//         const userList = userSnapShot.docs.map(doc => doc.data())
//         console.log(userList)
//     } catch (error) {
//         console.log(error.message)
//         console.log(rejectWithValue(error.message))
//     }

// }
export const sendMessage = createAsyncThunk(
    'user/sendMessage',
    async ({ senderId, recieverId, messageText, recieverPhotoURL, recieverDisplayName }, { rejectWithValue }) => {
        try {
            await addDoc(collection(db, 'messages'), {
                senderId: senderId,
                recieverId: recieverId,
                messageText: messageText,
                recieverPhotoURL: recieverPhotoURL,
                recieverDisplayName: recieverDisplayName,
                timestamp: new Date(),

            })

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)
export const sendFriendRequest = createAsyncThunk(
    'user/sendFriendRequest',
    async ({ userId, friendUid, friendDisplayName, friendPhotoUrl }, { rejectWithValue }) => {
        const requestId = `${friendUid}_${userId}`.trim();  // Ensure a consistent requestId format
        try {
            await addDoc(collection(db, 'friendRequests'), {
                from: friendUid,
                to: userId,
                status: 'pending',
                friendPhotoUrl: friendPhotoUrl,
                friendDisplayName: friendDisplayName,
                requestId: requestId,
            });
            return { userId, friendUid, friendPhotoUrl, friendDisplayName };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// export const acceptFriendRequest = createAsyncThunk(
//     'user/acceptFriendRequest',
//     async ({ requestId, userId, friendId }, { rejectWithValue }) => {

//         try {
//             let friendReqDocRef = doc(db, 'friendRequests', requestId);
//             const friendReqDoc = await getDoc(friendReqDocRef);
//             // console.log(friendReqDoc)

//             if (!friendReqDoc.exists()) {
//                 console.error("Friend request document not found!");
//                 return rejectWithValue("Friend request document not found.");
//             }

//             // Proceed with the update if the document exists
//             await updateDoc(friendReqDocRef, {
//                 status: 'accepted'
//             });


//             // await updateDoc(doc(db, 'users', userId), {
//             //     friends: firebase.firestore.FieldValue.arrayUnion(friendId)
//             // });

//             // await updateDoc(doc(db, 'users', friendId), {
//             //     friends: firebase.firestore.FieldValue.arrayUnion(userId)
//             // });

//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

export const acceptFriendRequest = createAsyncThunk(
    'user/acceptFriendRequest',
    async ({ requestId, userId, friendId }, { rejectWithValue }) => {
        try {
            const friendReqDocRef = doc(db, 'friendRequests', requestId);
            const friendReqDoc = await getDoc(friendReqDocRef);

            if (!friendReqDoc.exists()) {
                console.error("Friend request document not found!");
                return rejectWithValue("Friend request document not found.");
            }

            await updateDoc(friendReqDocRef, {
                status: 'accepted'
            });

            await updateDoc(doc(db, 'users', userId), {
                friends: firebase.firestore.FieldValue.arrayUnion(friendId)
            });

            await updateDoc(doc(db, 'users', friendId), {
                friends: firebase.firestore.FieldValue.arrayUnion(userId)
            });

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const getUserByDisplayName = async (displayName) => {
    try {
        const q = query(collection(db, 'users'), where('displayName', '==', displayName));
        const querySnapshot = await getDocs(q);

        const users = querySnapshot.docs.map(doc => doc.data());

        if (users.length > 0) {
            console.log('User found:', users);
            return users[0];
        } else {
            console.log('No user found with displayName:', displayName);
            return null;
        }
    } catch (error) {
        console.error('Failed to get user by displayName:', error);
    }
};
export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const userCollections = collection(db, 'users');
            const userSnapShot = await getDocs(userCollections);

            const userList = userSnapShot.docs.map(doc => doc.data());
            // console.log(userList); 
            return userList;

        } catch (error) {
            console.error('Failed to fetch users:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const signUp = createAsyncThunk(
    'user/signUp',
    async ({ firstName, lastName, email, password, photoURL }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const displayName = `${firstName} ${lastName}`;

            await updateProfile(user, { displayName, photoURL }); // Set photoURL here

            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date(),
            });

            console.log("User created and saved to Firestore.");
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
        } catch (error) {
            console.error("Sign-up error:", error);
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);


export const logIn = createAsyncThunk(
    'user/logIn',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('currently entered email and password', email, password)
            const user = userCredential.user;
            console.log('user', user)

            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName // This will be the full name set during sign-up
            };
        } catch (error) {
            console.error("Login error:", error);
            return rejectWithValue(error.message || 'An error occurred during login');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            console.log("Attempting to send reset email to:", email);
            const authInstance = getAuth();
            await sendPasswordResetEmail(authInstance, email);
            console.log("Reset email sent successfully.");
            return { email };
        } catch (error) {
            console.error("Failed to send reset email:", error);
            return rejectWithValue(error.message || 'Failed to reset password');
        }
    }
);
const refreshUserData = async (user) => {
    try {
        await updateCurrentUser(getAuth(), user);
    } catch (error) {
        console.error("Error refreshing user data:", error);
    }
};
const UserSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
        status: 'idle',
        error: null,
        users: [],
        userPhotoURL: null,
        ShowChatBox: false,
        showMessangerModal: false,
        showMenu:false
    },
    reducers: {
        setShowMenu: (state, action) => {
            state.showMenu = action.payload
        },
        setShowChatBox: (state, action) => {
            state.ShowChatBox = action.payload
        },
        setshowMessangerModal: (state, action) => {
            state.showMessangerModal = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.userPhotoURL = action.payload.photoURL; // Set photoURL in state
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.userPhotoURL = null; // Clear photoURL
        },
        updateUserPhotoURL: (state, action) => {
            state.userPhotoURL = action.payload;
        }
    },


    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.user = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            .addCase(logIn.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(logIn.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.user = action.payload;
                refreshUserData()
            })
            .addCase(logIn.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.user = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.users = action.payload; // Update users property
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                // Handle successful friend request
                console.log('Friend request sent:', action.payload);
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                // Handle error in friend request
                console.error('Failed to send friend request:', action.payload);
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                // Handle successful friend request
                console.log('Friend request accepted', action.payload);
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                // Handle error in friend request
                console.error('Friend request rejected', action.payload);
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                // Handle successful friend request
                console.log('message sent', action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                // Handle error in friend request
                console.error('could not send message', action.payload);
            });
    }
});

export const { setUser, clearUser, setUserPhotoURL, setShowChatBox, setshowMessangerModal,setShowMenu } = UserSlice.actions;
export default UserSlice.reducer;
