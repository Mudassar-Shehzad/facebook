import React, { useEffect, useState } from 'react';
import { FaComment, FaRegThumbsUp, FaShare, FaSmile, FaImage, FaThumbsUp, FaRegComment, FaShareAlt } from 'react-icons/fa';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../features/user/UserSlice';
import { useNavigate } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';

function Posts() {
    const db = getFirestore();

    const [commentTexts, setCommentTexts] = useState({}); // State to hold comments for each post
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const user = useSelector((state) => state.user.user);
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';

    useEffect(() => {
        const postCollection = collection(db, 'allPosts');

        const unsubscribe = onSnapshot(postCollection, (snapShot) => {
            const data = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(data);
        }, (error) => {
            console.error('Error fetching posts:', error.message);
        });

        return () => unsubscribe();
    }, []);

    const handleLikePost = async (postId) => {
        const postRef = doc(db, 'allPosts', postId);
        const post = posts.find(post => post.id === postId);
        const hasLiked = post.likedBy?.includes(user.uid);

        try {
            if (hasLiked) {
                await updateDoc(postRef, {
                    postLikes: post.postLikes - 1,
                    likedBy: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(postRef, {
                    postLikes: post.postLikes + 1,
                    likedBy: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error('Error updating likes:', error.message);
        }
    };

    const handleSubmitComment = async (e, postId) => {
        e.preventDefault();

        if (!commentTexts[postId]) {
            return;
        }

        const postRef = doc(db, 'allPosts', postId);
        const newComment = {
            text: commentTexts[postId],
            timestamp: new Date(),
            commenterPhotoUrl: user.photoURL,
            commentDisplayName: user.displayName,
        };

        try {
            await updateDoc(postRef, {
                postComments: arrayUnion(newComment),
            });
            setCommentTexts(prev => ({ ...prev, [postId]: '' })); // Clear the comment text for that post
        } catch (error) {
            console.error('Failed to post comment', error.message);
        }
    };

    const handleCommentChange = (e, postId) => {
        const { value } = e.target;
        setCommentTexts(prev => ({ ...prev, [postId]: value }));
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleTimeString();
        }
        return 'Unknown Time';
    };

    const handleGetToUserProfile = async (e, post) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(getAllUsers());
            if (getAllUsers.fulfilled.match(resultAction)) {
                const userList = resultAction.payload;
                let filteredUser = userList.filter((u) => post.postOwner.uid === u.uid);
                navigate('userDisplay', { state: { filteredUser } });
            } else {
                console.error('Failed to fetch users:', resultAction.payload);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div>
            {posts.length > 0 ? (
                posts.map(post => (
                    <div key={post.id} className="bg-white rounded-md shadow-all-sides mb-5 shadow-lg">
                        {/* Post header */}
                        <div className="flex items-center p-4 border-b border-gray-200">
                            <img
                                src={post.postOwner?.photoURL || placeholderImage}
                                alt="Post Owner"
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <button onClick={(e) => handleGetToUserProfile(e, post)} className="cursor-pointer font-semibold hover:underline">
                                    {post.postOwner?.displayName || 'Unknown User'}
                                </button>
                                <h1 className="text-gray-400 text-sm ml-2 cursor-pointer hover:underline">
                                    {formatDate(post.createdAt)}
                                </h1>
                            </div>
                        </div>
                        {/* Post content */}
                        <div>
                            <p className="text-md my-3 mx-1">{post.postText || 'No content available'}</p>
                            {post.postUrl && (
                                <img
                                    src={post.postUrl}
                                    alt="Post"
                                    className="w-full"
                                />
                            )}
                        </div>
                        {/* Post actions */}
                        <div className="border-t border-gray-200 p-4">
                            <div className="flex justify-between text-md font-normal">
                                <div className='ml-3 flex space-x-1'>
                                    {post.postLikes > 0 && (
                                        <>
                                            <h1 className='bg-blue-500 rounded-full h-6 w-6 flex items-center justify-center text-center'>
                                                <FaThumbsUp size={12} className='text-white' />
                                            </h1>
                                            <span>{post.postLikes}</span>
                                        </>
                                    )}
                                </div>
                                <div className='flex space-x-2'>
                                    <ul className='flex items-center space-x-2'>
                                        <li className='flex items-center space-x-1 text-gray-600 px-1 cursor-pointer'>
                                            <span>{post.postComments?.length || 0}</span>
                                            <FaComment size={18} className='text-gray-600' />
                                        </li>
                                        <li className='flex items-center space-x-1 text-gray-600 px-1 cursor-pointer'>
                                            <span>0</span>
                                            <FaShare size={18} className='text-gray-600' />
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 my-3"></div>
                            <div className='flex justify-between'>
                                <div
                                    onClick={() => handleLikePost(post.id)}
                                    className={`rounded-lg flex items-center justify-center text-lg space-x-1 p-2 w-[8rem] hover:bg-gray-100 cursor-pointer ${post.likedBy?.includes(user.uid) ? 'text-blue-600' : ''}`}
                                >
                                    {post.likedBy?.includes(user.uid) ? <FaThumbsUp /> : <FaRegThumbsUp />}
                                    <span>Like</span>
                                </div>
                                <div
                                    className='rounded-lg flex items-center text-gray-700 justify-center text-lg space-x-1 p-2 w-[8rem] hover:bg-gray-100 cursor-pointer'>
                                    <FaRegComment size={20} />
                                    <span>Comment</span>
                                </div>
                                <div className='rounded-lg flex items-center text-gray-700 justify-center text-lg space-x-1 p-2 w-[8rem] hover:bg-gray-100 cursor-pointer'>
                                    <FaShare />
                                    <span>Share</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 my-3"></div>

                            <div className='max-h-32 overflow-y-scroll'>
                                {post.postComments?.length > 0 ? post.postComments.map((comment, index) => (
                                    <div key={index} className='p-2 flex items-start space-x-2'>
                                        <img src={comment.commenterPhotoUrl || placeholderImage} className='h-10 w-10 rounded-full' />
                                        <div className='flex-1 p-2 bg-gray-100 rounded-lg'>
                                            <button onClick={(e) => handleGetToUserProfile(e, post)} className='font-semibold text-gray-700'>{comment.commentDisplayName}</button>
                                            <p className='text-gray-600'>{comment.text}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className='text-center text-gray-400'>No comments yet.</p>
                                )}
                            </div>

                            <form onSubmit={(e) => handleSubmitComment(e, post.id)} className='p-4 flex space-x-2'>
                                <img src={user.photoURL || placeholderImage} className='h-10 w-10 rounded-full' />
                                <input
                                    type='text'
                                    value={commentTexts[post.id] || ''}
                                    onChange={(e) => handleCommentChange(e, post.id)}
                                    placeholder="Write a comment..."
                                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg'
                                />
                                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-lg'>
                                    Post
                                </button>
                            </form>
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
}
export default Posts;