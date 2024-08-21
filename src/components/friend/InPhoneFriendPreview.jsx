import { collection, getFirestore, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {  FaRegThumbsUp, FaShare, FaThumbsUp, FaRegComment, FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { sendFriendRequest, setShowChatBox } from '../../features/user/UserSlice';
function InPhoneFriendPreview() {
    const placeholder = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
    
    const db = getFirestore();
    const dispatch = useDispatch();
    const location = useLocation();
    const { filteredUser, friend } = location.state || {};
    console.log(friend)
    const [userPosts, setUserPosts] = useState([]);
    const [filteredUserUid, setFilteredUserUid] = useState('');
    const [commentText, setCommentText] = useState('');
    const [user, setUser] = useState(null);
    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleTimeString();
        }
        return 'Unknown Time';
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

    const handleSubmitComment = async (e, postId) => {
        e.preventDefault();

        if (!commentText) {
            return;
        }

        const postRef = doc(db, 'allPosts', postId);
        const newComment = {
            text: commentText,
            timestamp: new Date(),
            commenterPhotoUrl: currentUser.photoURL,
            commentDisplayName: currentUser.displayName,
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
        if (friend && friend.length > 0) {
            const userUid = friend[0].uid;
            setFilteredUserUid(userUid);
            setUser(friend[0]);

            const postCollection = collection(db, 'allPosts');
            const unsubscribe = onSnapshot(postCollection, (snapShot) => {
                const data = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const filteredPosts = data.filter((d) => d.postOwner.uid === userUid);
                setUserPosts(filteredPosts);
            }, (error) => {
                console.error('Error fetching posts:', error.message);
            });

            return () => unsubscribe();
        }
    }, [friend]);
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

        }
    }, [filteredUser, db]);
  return (
    <div>
       <div className='h-full bg-red-400 '>
            <div className="bg-gray-100">
                <div className="h-[90vh] overflow-y-scroll bg-gray-100">
                    <div className="bg-white flex flex-col  items-center h-[65vh]">
              
                        {/* Cover and Profile Photo */}
                        <div className="relative w-full h-[60vh]">
                            <img
                                src={friend.coverURL || placeholder}
                                alt="Cover"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-[-50px] left-[20%] transform -translate-x-1/2 border-4 rounded-full border-white">
                                <img
                                    src={friend.photoURL || placeholder}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="relative w-[70%]  flex justify-between">
                            <div className="absolute -bottom-3 -left-[9rem] mt-12 text-center ml-48 flex content-center w-full h-full flex-col ">
                                <h1 className="text-2xl font-bold">{friend.displayName}</h1>
                            </div>
                            <div className="absolute right-0 -top-5 flex justify-center mt-4 p-4 space-x-3">
                              
                            </div>
                        </div>
                    </div>

                    {/* User Details and Posts Section */}
                    <div className="flex  flex-col mt-4 p-2 space-y-3">
                        <div className=" space-y-4">
                            <div className="p-4 bg-white rounded-md shadow">
                                <h2 className="font-semibold text-lg mb-3">Intro</h2>
                                <p className="text-gray-600">{friend.userBio || 'User has no intro'}</p>
                            </div>

                            <div className="p-4 bg-white rounded-md shadow">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="font-semibold text-lg">Friends</h2>
                                    <Link className="text-blue-500">See All Friends</Link>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Here you would map through friend[0].friends if it exists */}
                                    <p className="text-gray-400">No friends to show</p>
                                </div>
                            </div>
                        </div>

                        {/* Posts Section */}
                        <div className="items-center pl-4">
                            <div id="posts" className="bg-white p-4 rounded-md ">
                                <h2 className="font-semibold text-lg mb-3">Posts</h2>
                                {userPosts.length > 0 ? userPosts.map((post) => (
                                    <div key={post.id} className="bg-white mb-5 shadow rounded-md">
                                        <div className="flex items-center p-4 border-b border-gray-200">
                                            <img
                                                src={post.postOwner.photoURL || placeholder}
                                                alt="Post Owner"
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <div>
                                                <button
                                                    onClick={(e) => handleGetToUserProfile(e, post)}
                                                    className="cursor-pointer font-semibold hover:underline">
                                                    {post.postOwner.displayName || 'Unknown User'}
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
                                                <div
                                                    onClick={() => handleLikePost(post.id)}
                                                    className={`rounded-lg flex items-center justify-center text-lg space-x-1 p-2 w-[8rem] hover:bg-gray-100 cursor-pointer ${post.likedBy?.includes(user.uid) ? 'text-blue-600' : ''}`}
                                                >
                                                    {post.likedBy?.includes(user.uid) ? <FaThumbsUp /> : <FaRegThumbsUp />}
                                                    <span>Like</span>
                                                </div>
                                                <button className="flex items-center justify-center space-x-2 p-2 w-1/3 rounded-md hover:bg-gray-100">
                                                    <FaRegComment size={20} />
                                                    <span>Comment</span>
                                                </button>
                                                <button className="flex items-center justify-center space-x-2 p-2 w-1/3 rounded-md hover:bg-gray-100">
                                                    <FaShare size={20} />
                                                    <span>Share</span>
                                                </button>
                                            </div>

                                            <div className="mt-4">
                                                {post.postComments?.length > 0 && post.postComments.map((comment, index) => (
                                                    <div key={index} className="flex items-center mb-4">
                                                        <img
                                                            src={comment.commenterPhotoUrl || placeholder}
                                                            alt="Commenter"
                                                            className="w-10 h-10 rounded-full mr-3"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">{comment.commentDisplayName || 'Unknown User'}</span>
                                                            <span className="text-gray-500">{comment.text || 'No comment'}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <form onSubmit={(e) => handleSubmitComment(e, post.id)} className="flex items-center mt-4">
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full"
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-2"
                                                >
                                                    Comment
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-gray-400 text-center">
                                        <p>No posts to display</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InPhoneFriendPreview
