import { collection, getFirestore, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, query, and, where, or } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaUserFriends, FaEllipsisH, FaFacebookMessenger, FaComment, FaRegThumbsUp, FaShare, FaSmile, FaImage, FaThumbsUp, FaRegComment, FaPaperPlane } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sendFriendRequest, setShowChatBox } from '../../features/user/UserSlice';

function UserDisplay() {
    const db = getFirestore();
    const dispatch = useDispatch();
    const location = useLocation();
    const { filteredUser } = location.state || {};
    const [userPosts, setUserPosts] = useState([]);
    const [filteredUserUid, setFilteredUserUid] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isFriend, setIsFriend] = useState(false);
    const [user, setUser] = useState(null);
    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const handleSendFriendRequest = async () => {
        try {
            await dispatch(sendFriendRequest({ userId: filteredUserUid, friendUid: currentUser.uid, friendPhotoUrl:currentUser.photoURL, friendDisplayName:currentUser.displayName })).unwrap();
            alert('Sent friend request');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLikePost = async (postId) => {
        const postRef = doc(db, 'allPosts', postId);
        const post = userPosts.find(post => post.id === postId);
        const hasLiked = post.likedBy?.includes(currentUser.uid);

        try {
            if (hasLiked) {
                await updateDoc(postRef, {
                    postLikes: post.postLikes - 1,
                    likedBy: arrayRemove(currentUser.uid)
                });
            } else {
                await updateDoc(postRef, {
                    postLikes: post.postLikes + 1,
                    likedBy: arrayUnion(currentUser.uid)
                });
            }
        } catch (error) {
            console.error('Error updating likes:', error.message);
        }
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleTimeString();
        }
        return 'Unknown Time';
    };

    const handleSubmitComment = async (e, postId) => {
        e.preventDefault();

        if (!commentText) {
            return;
        }

        const postRef = doc(db, 'allPosts', postId);
        const newComment = {
            text: commentText,
            timestamp: new Date(),
            commenterPhotoUrl: currentUser?.photoURL,
            commentDisplayName: currentUser?.displayName,
        };

        try {
            await updateDoc(postRef, {
                postComments: arrayUnion(newComment),
            });
            setCommentText('');
        } catch (error) {
            console.error('Failed to post comment', error.message);
        }
    };

    useEffect(() => {
        if (filteredUser && filteredUser.length > 0) {
            const userUid = filteredUser[0].uid;
            setFilteredUserUid(userUid);
            setUser(filteredUser[0]);

            const postCollection = collection(db, 'allPosts');
            const unsubscribe = onSnapshot(postCollection, (snapShot) => {
                const data = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const filteredPosts = data.filter((d) => d.postOwner.uid === userUid);
                setUserPosts(filteredPosts);
            }, (error) => {
                console.error('Error fetching posts:', error.message);
            });

            return () => unsubscribe();
        } else {
            setFilteredUserUid('');
            setUser(null);
            setUserPosts([]);
        }
    }, [filteredUser, db]);

    useEffect(() => {
        if (currentUser && filteredUserUid) {
            const q = query(
                collection(db, 'friendRequests'),
                and(
                    where('status', '==', 'accepted'),
                    or(
                        where('from', '==', currentUser.uid),
                        where('to', '==', currentUser.uid)
                    ),
                    or(
                        where('from', '==', filteredUserUid),
                        where('to', '==', filteredUserUid)
                    )
                )
            );
    
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setIsFriend(!snapshot.empty);
            });
    
            return () => unsubscribe();
        } else {
            setIsFriend(false);
        }
    }, [currentUser, filteredUserUid, db]);

    const handleGoToChatBox = (e) => {
        if (user) {
            navigate('/', { state: { recieverUid: user.uid, reciever: user, recieverDisplayName: user.displayName, recieverPhotoURL: user.photoURL } });
            dispatch(setShowChatBox(true));
        }
        e.preventDefault();
    };

    if (!user) {
        return <div>Loading...</div>;
    }

        return (
        <div className="bg-gray-100">
            <div className="h-[90vh] overflow-y-scroll bg-gray-100">
                <div className="bg-white flex flex-col items-center h-auto laptop:h-[80vh]">
                    {/* Cover and Profile Photo */}
                    <div className="relative w-[90%] h-[30vh] tablet:h-[40vh] laptop:h-[50vh]">
                        <img
                            src={user.coverURL || 'https://via.placeholder.com/800x300.png?text=Cover+Photo'}
                            alt="Cover"
                            className="h-full w-full object-cover rounded-lg"
                        />
                        <div className="absolute bottom-[-50px] laptop:left-[10%] tablet:left-[12%] phone:left-[14%] left-[18%] transform -translate-x-1/2 border-4 rounded-full border-white">
                            <img
                                src={user.photoURL || 'https://via.placeholder.com/150.png?text=Profile+Photo'}
                                alt="Profile"
                                className="w-24 h-24 phone:w-32 phone:h-32 rounded-full object-cover"
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-col tablet:flex-row
                    relative flex w-full items-end justify-between p-4 laptop:px-32 phone:px-32 laptop:mt-10 phone:mt-10 ">
                        <div className="flex w-auto mb-4 space-y-2">
                            <h1 className="text-xl phone:text-2xl laptop:text-3xl font-bold">{user.displayName}</h1>
                            {user.friendCount && (
                                <p className="text-gray-600">{user.friendCount} friends</p>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            {!isFriend && (
                                <button
                                    onClick={handleSendFriendRequest}
                                    className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm phone:text-base"
                                >
                                    Add Friend
                                </button>
                            )}
                            <button
                                onClick={(e) => handleGoToChatBox(e)}
                                className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm phone:text-base flex items-center"
                            >
                                <FaFacebookMessenger className="mr-2" />
                                Message
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                </div>

                {/* User Details and Posts Section */}
                <div className="flex flex-col tablet:flex-row tablet:space-x-3 justify-center mt-4 p-2">
                    <div className="w-full laptop:w-1/4 space-y-4 mb-4 laptop:mb-0">
                        <div className="p-4 bg-white rounded-md shadow">
                            <h2 className="font-semibold text-lg mb-3">Intro</h2>
                            {user.userBio ? (
                                <p className="text-gray-600">{user.userBio}</p>
                            ) : (
                                <p className="text-gray-400">User has no intro</p>
                            )}
                        </div>

                        <div className="p-4 bg-white rounded-md shadow">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="font-semibold text-lg">Friends</h2>
                                <Link className="text-blue-500">See All Friends</Link>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {user.friends && user.friends.length > 0 ? (
                                    user.friends.map((friend) => (
                                        <div key={friend.id} className="text-center">
                                            <img src={friend.photoURL} alt={friend.displayName} className="w-full h-24 object-cover rounded-md" />
                                            <p className="text-sm">{friend.displayName}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No friends to show</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Posts Section */}
                    <div className="w-full laptop:w-3/5 pl-0 laptop:pl-4">
                        <div id="posts" className="bg-white p-4 rounded-md">
                            <h2 className="font-semibold text-lg mb-3">Posts</h2>
                            {userPosts.length > 0 ? userPosts.map((post) => (
                                <div key={post.id} className="bg-white mb-5 shadow rounded-md">
                                    <div className="flex items-center p-4 border-b border-gray-200">
                                        <img
                                            src={post.postOwner?.photoURL || 'https://via.placeholder.com/150.png?text=Photo+1'}
                                            alt="Post Owner"
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <button className="cursor-pointer font-semibold hover:underline">
                                                {post.postOwner?.displayName || 'Unknown User'}
                                            </button>
                                            <span className="text-gray-400 text-sm ml-2">
                                                {formatDate(post.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-md mb-3">{post.postText || 'No content available'}</p>
                                        {post.postUrl && (
                                            <img
                                                src={post.postUrl}
                                                alt="Post"
                                                className="w-full h-64 object-cover rounded-md"
                                            />
                                        )}
                                    </div>
                                    <div className="border-t border-gray-200 p-4">
                                        <div className="flex justify-between text-md font-normal">
                                            <div className="flex items-center space-x-1">
                                                {post.postLikes > 0 && (
                                                    <>
                                                        <div className="bg-blue-500 rounded-full h-6 w-6 flex items-center justify-center text-center">
                                                            <FaThumbsUp size={12} className="text-white" />
                                                        </div>
                                                        <span>{post.postLikes}</span>
                                                    </>
                                                )}
                                            </div>
                                            {post.postComments?.length > 0 && (
                                                <div>
                                                    <span className="text-gray-500">{post.postComments.length} comments</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between text-gray-500 text-md font-light border-t border-gray-200 mt-2 pt-2">
                                            <button onClick={() => handleLikePost(post.id)} className={`flex items-center justify-center space-x-2 p-2 w-1/3 rounded-md hover:bg-gray-100 ${post.likedBy?.includes(user.uid) ? 'text-blue-500' : ''}`}>
                                                <FaRegThumbsUp size={20} />
                                                <span>Like</span>
                                            </button>
                                            <button className="flex items-center justify-center space-x-2 p-2 w-1/3 rounded-md hover:bg-gray-100">
                                                <FaRegComment size={20} />
                                                <span>Comment</span>
                                            </button>
                                            <button className="flex items-center justify-center space-x-2 p-2 w-1/3 rounded-md hover:bg-gray-100">
                                                <FaShare size={20} />
                                                <span>Share</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="border-t border-gray-200 p-4">
                                        <div>
                                            {post.postComments?.length > 0 && post.postComments.map((comment, index) => (
                                                <div key={index} className="flex mb-4">
                                                    <img
                                                        src={comment.commenterPhotoUrl || 'https://via.placeholder.com/150.png?text=User'}
                                                        alt="Commenter"
                                                        className="w-8 h-8 rounded-full mr-3"
                                                    />
                                                    <div className="bg-gray-100 p-2 rounded-md w-full">
                                                        <div className="font-semibold text-sm">
                                                            {comment.commentDisplayName || 'Unknown User'}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {comment.text || 'No comment text'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center">
                                            <img
                                                src={user.photoURL || 'https://via.placeholder.com/150.png?text=Profile'}
                                                alt="User"
                                                className="w-8 h-8 rounded-full mr-3"
                                            />
                                            <form onSubmit={(e) => handleSubmitComment(e, post.id)} className="flex-grow">
                                                <input
                                                    type="text"
                                                    className="w-full p-2 bg-gray-100 rounded-md"
                                                    placeholder="Write a comment..."
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-400">No posts available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default UserDisplay;
