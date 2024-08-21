import { collection, query, where, onSnapshot, getDocs, or, and } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFirestore } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const db = getFirestore();

function FrindsList({ setUser, setPreview, friend }) {
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
    const navigate = useNavigate()
    const currentUser = useSelector((state) => state.user.user);
    const [friends, setFriends] = useState([]);

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
                    setFriends(friendsList);
                    setUser(friendsList)
                } else {
                    setFriends([]);
                    setUser([]);
                }
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const handleShowFriend = () => {
        setPreview(true)
        setUser(friends)
    }
    const handleGoToFriendPreview = (friend) => {
        navigate('/phoneFriendPreview', {state:{filteredUser:friend, friend:friend}})
    }
    return (
        <div className='min-w-[20rem] h-full p-2 laptop:border-r'>
            <div className='hidden tablet:flex flex-col'>

            <h1 className='text-2xl font-bold'>All Friends</h1>

            {
                friends.length > 0 ?
                    friends.map((friend) => (

                        <ul key={friend.uid} className=' w-full h-[80vh] p-2 overflow-y-scroll space-y-2 mt-3'>


                            <li
                                onClick={handleShowFriend}
                                className='w-full flex items-center space-x-1 p-1 hover:bg-gray-100 rounded-lg cursor-pointer'>
                                <img src={friend.photoURL || placeholderImage} alt="profile" className='h-10 w-10 rounded-full' />
                                <h1 className='text-xl '>{friend.displayName}</h1>
                            </li>

                        </ul>
                    )) :
                    <p>no friends</p>
            }
            </div>

            <div className='flex tablet:hidden'>

            {
                friends.length > 0 ?
                    friends.map((friend) => (

                        <ul key={friend.uid} className=' w-full h-[80vh] p-2 overflow-y-scroll space-y-2 mt-3'>


                            <li
                                onClick={() => handleGoToFriendPreview(friend)}
                                className='flex items-center space-x-1 p-1 hover:bg-gray-100 rounded-lg cursor-pointer'>
                                <img src={friend.photoURL || placeholderImage} alt="profile" className='h-10 w-10 rounded-full' />
                                <h1 className='text-xl'>{friend.displayName}</h1>
                            </li>

                        </ul>
                    )) :
                    <p>no friends</p>
            }
            </div>

        </div>
    )
}

export default FrindsList
