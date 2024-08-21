import { collection, query, where, onSnapshot, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { db } from '../../firebase/firebase';
const db = getFirestore()
function FriendRequestNotifications() {
  const [friendRequests, setFriendRequests] = useState([]);
  const currentUser = useSelector((state) => state.user.user);
  const [user, setUser] = useState([])

  useEffect(() => {
    if (currentUser?.uid) {
      const q = query(collection(db, 'friendRequests'), where('to', '==', currentUser.uid), where('status', '==', 'pending'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFriendRequests(requests);
      }, (error) => {
        console.error("Error fetching friend requests: ", error.message);
        if (error.code === "permission-denied") {
          alert("You don't have permission to access friend requests.");
        }
      });
  
      return () => unsubscribe();
    }
  }, [currentUser]);
  
  return (
    <div>
      {friendRequests.length > 0 && (
        <div>
          <h3>You have {friendRequests.length} new friend request(s)</h3>
          <ul>
            {friendRequests.map((request) => (
              <li key={request.diplayName}>{request.from} sent you a friend request!</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FriendRequestNotifications;
