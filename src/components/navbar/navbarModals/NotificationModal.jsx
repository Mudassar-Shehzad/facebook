import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TruncatedText from '../../TruncatedText';
import { acceptFriendRequest } from '../../../features/user/UserSlice';

function NotificationModal() {
  // const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const dispatch = useDispatch()
  // const user = useSelector((state) => state.user.user);
  const db = getFirestore();
  const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
  const currentUser = useSelector((state) => state.user.user);

  // useEffect(() => {
  //     if (user) {
  //         const friendRequestsRef = collection(db, 'friendRequests');
  //         const q = query(friendRequestsRef, where("to", "==", user.uid), orderBy("timestamp", "desc"));

  //         const unsubscribe = onSnapshot(q, async (snapshot) => {
  //             const data = await Promise.all(snapshot.docs.map(async (doc) => {
  //                 const friendRequest = doc.data();
  //                 const senderDoc = await getDoc(doc(db, "users", friendRequest.from));
  //                 const senderData = senderDoc.exists() ? senderDoc.data() : null;
  //                 return {
  //                     id: doc.id,
  //                     ...friendRequest,
  //                     senderName: senderData?.displayName || "Unknown",
  //                     senderPhoto: senderData?.photoURL || placeholderImage,
  //                 };
  //             }));
  //             setNotifications(data);
  //         });

  //         return () => unsubscribe();
  //     }
  // }, [user, db]);
  useEffect(() => {
    if (currentUser?.uid) {
      const q = query(
        collection(db, 'friendRequests'),
        where('to', '==', currentUser.uid),
        where('status', '==', 'pending')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFriendRequests(requests);
      }, (error) => {
        console.error("Error fetching friend requests: ", error.message);
        if (error.code === "permission-denied") {
          alert("You don't have permission to access friend requests.");
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser, db]);

  const handleAcceptRequest = async (e, notification) => {
    e.preventDefault();

    const userId = notification.from;
    const friendId = notification.to;
    const requestId = notification.id;  // Use the ID directly from Firestore

    try {
        let waitToAccept = await dispatch(acceptFriendRequest({
            requestId,
            userId,
            friendId,
        }));

        if (waitToAccept) {
            alert('Friend request accepted');
        }

    } catch (error) {
        alert(error.message);
    }
};


  return (
    <div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="space-y-2 flex  flex-col absolute top-12 right-16 mt-2 p-2 border bg-white border-gray-300 rounded shadow-lg z-10">
        <h1 className='text-2xl font-bold mb-2'>Notifications</h1>
        {friendRequests.length > 0 ?
          (
            friendRequests.map(notification => (
              <div key={notification.requestId} className='flex space-x-2 max-h-32 hover:bg-gray-100 p-2 items-center rounded-lg'>
                <img src={notification.friendPhotoUrl || placeholderImage} className='h-16 w-16 rounded-full' alt="Sender" />
                <div>
                  <p className='font-semibold'>{notification.friendDisplayName}</p>
                  <TruncatedText text={`sent you a friend request`} limit={50} />
                  <button
                    onClick={(e) => handleAcceptRequest(e, notification)}
                    className='px-3 py-2 bg-blue-400 mx-2 rounded-lg'>Accept</button>
                  <button className='px-3 py-2  border-blue-400 border-2 mx-2 rounded-lg'>Decline</button>
                </div>
              </div>))
          ) : (
            <div className='text-center'>
              <p className='text-lg'>No notifications yet</p>
            </div>)
        }
      </div>
    </div>
  );
}

export default NotificationModal;
