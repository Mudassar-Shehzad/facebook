import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllUsers, sendFriendRequest, setShowChatBox } from '../../features/user/UserSlice';
import { collection, getFirestore, onSnapshot, query, where, and, or } from 'firebase/firestore';

const db = getFirestore();

function SearchedUser() {
    const location = useLocation();
    const { searchedUsers } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [usersToDisplay, setUsersToDisplay] = useState([]);
    const [sentRequests, setSentRequests] = useState(new Set());
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [friendStatuses, setFriendStatuses] = useState({});

    useEffect(() => {
        if (currentUser && searchedUsers && searchedUsers.length > 0) {
            const userUids = searchedUsers.map(user => user.uid);
    
            const q = query(
                collection(db, 'friendRequests'),
                and(
                    where('status', '==', 'accepted'),
                    or(
                        where('from', '==', currentUser.uid),
                        where('to', '==', currentUser.uid)
                    ),
                    or(
                        where('from', 'in', userUids),
                        where('to', 'in', userUids)
                    )
                )
            );
    
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newFriendStatuses = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.from === currentUser.uid) {
                        newFriendStatuses[data.to] = true;
                    } else if (data.to === currentUser.uid) {
                        newFriendStatuses[data.from] = true;
                    }
                });
                setFriendStatuses(newFriendStatuses);
            });
    
            return () => unsubscribe();
        } else {
            setFriendStatuses({});
        }
    }, [currentUser, searchedUsers, db]);
    

    useEffect(() => {
        if (currentUser?.uid) {
            const q = query(
                collection(db, 'friendRequests'),
                where('from', '==', currentUser.uid),
                where('status', '==', 'pending')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const requestIds = new Set(snapshot.docs.map(doc => doc.data().to));
                setSentRequests(requestIds);
            }, (error) => {
                console.error("Error fetching friend requests: ", error.message);
                if (error.code === "permission-denied") {
                    alert("You don't have permission to access friend requests.");
                }
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const handleSendFriendRequest = async (user) => {
        setLoading(true);
        try {
            await dispatch(sendFriendRequest({
                userId: user.uid,
                friendUid: currentUser.uid,
                friendPhotoUrl: currentUser.photoURL,
                friendDisplayName: currentUser.displayName,
                requestId: `${user.uid}${currentUser.uid}`.trim(),
            })).unwrap();
            setSentRequests(prevState => new Set([...prevState, user.uid]));
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchedUsers) {
            setUsersToDisplay(Array.isArray(searchedUsers) ? searchedUsers : [searchedUsers]);
        }
    }, [searchedUsers]);

    const handleGetToUserProfile = async (e, user) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(getAllUsers());
            if (getAllUsers.fulfilled.match(resultAction)) {
                const userList = resultAction.payload;
                const filteredUser = userList.find((u) => user.uid === u.uid);
                if (filteredUser) {
                    navigate('/userDisplay', { state: { filteredUser: [filteredUser] } });
                }
            } else {
                console.error('Failed to fetch users:', resultAction.payload);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
    const handleGoToChatBox = (e, user) => {
        e.preventDefault();
        navigate('/', { state: { recieverUid: user.uid, reciever: user, recieverDisplayName: user.displayName, recieverPhotoURL: user.photoURL } });
        dispatch(setShowChatBox(true));
    };

    return (
        <div className='py-2 flex w-full items-center flex-col space-y-4 overflow-y-scroll bg-slate-100 h-[90vh]'>
            {usersToDisplay.length > 0 ? (
                usersToDisplay.map((user) => (
                    <div key={user.uid} className='flex items-center flex-col phone:flex-row w-full justify-between px-5 py-2 bg-white rounded-lg tablet:w-[80%]'>
                        <div className='flex p-2 justify-start w-full'>
                            <img src={user.photoURL || placeholderImage} className='rounded-full h-20 w-20' alt="" />
                            <button onClick={(e) => handleGetToUserProfile(e, user)} className='text-xl ml-5 hover:underline'>{user.displayName}</button>
                        </div>
                        <div className='phone:space-x-2 flex flex-col phone:flex-row phone:justify-center phone:space-y-0  w-full space-y-2 tablet:w-96
                        '>
                            {!friendStatuses[user.uid] && (
                                <button
                                    onClick={() => handleSendFriendRequest(user)}
                                    className={`font-semibold p-2 rounded-lg ${sentRequests.has(user.uid) ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-600 w-full'}`}
                                    disabled={sentRequests.has(user.uid)}  
                                >
                                    {loading ? 'Loading...' : sentRequests.has(user.uid) ? 'Request Sent' : 'Add Friend'}
                                </button>
                            )}
                            <button
                                onClick={(e) => handleGoToChatBox(e, user)}
                                className='font-semibold p-2 rounded-lg bg-blue-400 hover:bg-blue-200 text-white w-full'
                            >Message</button>
                        </div>
                    </div>
                ))
            ) : (
                <h2 className='text-2xl'>No User exists with such name</h2>
            )}
        </div>
    );
}

export default SearchedUser;
