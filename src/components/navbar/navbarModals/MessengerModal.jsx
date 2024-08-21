import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, setShowChatBox, setshowMessangerModal } from '../../../features/user/UserSlice';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, getDocs, or, and, getFirestore } from 'firebase/firestore';
const db = getFirestore();

function MessengerModal() {
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);
    const showMessangerModal = useSelector((state) => state.user.showMessangerModal)
    const [userToChatWith, setUserToChatWith] = useState([]);

    useEffect(() => {
        if (currentUser?.uid) {
            const q = query(
                collection(db, 'friendRequests'),
                and(
                    where('status', '==', 'accepted'),
                    or(
                        where('from', '==', currentUser.uid),
                        where('to', '==', currentUser.uid)
                    )
                )
            );

            const unsubscribe = onSnapshot(q, async (snapshot) => {
                const friendUids = [];
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.from === currentUser.uid) {
                        friendUids.push(data.to);
                    } else if (data.to === currentUser.uid) {
                        friendUids.push(data.from);
                    }
                });

                if (friendUids.length > 0) {
                    const friendsRef = collection(db, 'users');
                    const friendsQuery = query(
                        friendsRef,
                        where('uid', 'in', friendUids)
                    );

                    const friendsSnapshot = await getDocs(friendsQuery);
                    const friendsList = friendsSnapshot.docs.map(doc => doc.data());
                    // console.log(friendsList);
                    setUserToChatWith(friendsList);
                } else {
                    setUserToChatWith([]);
                }
            });

            return () => unsubscribe();
        }
    }, [currentUser]);
    const handleOpenChat = async (user) => {
        let waitToClosePreviousChat = await dispatch(setShowChatBox(false))
        if (waitToClosePreviousChat) {
            try {
                // console.log('modal openen', showMessangerModal)
                dispatch(setshowMessangerModal(false))
                // console.log('modal closed', showMessangerModal)
                dispatch(setShowChatBox(true))
                // console.log('chatbox opend')
                navigate('/', { state: { recieverUid: user.uid, reciever: user, recieverPhotoURL: user.photoURL, recieverDisplayName: user.displayName } });
            } catch (error) {
                console.error("Failed to open chat:", error);
            }

        }

    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="space-y-2 flex  flex-col max-h-[80vh] overflow-y-scroll absolute top-12 right-28 mt-2 p-2 border bg-white border-gray-300 rounded shadow-lg z-10"
        >
            {userToChatWith.length !== 0 ? (
                userToChatWith.map((user) => (
                    <div
                        key={user.uid}
                        onClick={() => handleOpenChat(user)}
                        className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded-lg"
                    >
                        <img
                            src={user.photoURL || placeholderImage}
                            className="h-12 w-12 rounded-full"
                            alt="profile"
                        />
                        <h1 className="text-xl">{user.displayName}</h1>
                    </div>
                ))
            ) : (
                <div>

                    <div className=' p-2 flex space-x-2'>
                        <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                        <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
                    </div>
                    <div className=' p-2 flex space-x-2'>
                        <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                        <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
                    </div>
                    <div className=' p-2 flex space-x-2'>
                        <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                        <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
                    </div>
                    <div className=' p-2 flex space-x-2'>
                        <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                        <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
                    </div>
                    <div className=' p-2 flex space-x-2'>
                        <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                        <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
                    </div>
                    <div className=' p-2 flex space-x-2'>
                        <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                        <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
                    </div>
                    <div className=' p-2 flex space-x-2'>
                        <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                        <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
                    </div>
                    <div className=' p-2 flex space-x-2'>
                        <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                        <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessengerModal;
