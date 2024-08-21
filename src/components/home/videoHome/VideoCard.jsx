import React, { useState } from 'react';
import { FaRegComment, FaRegThumbsUp, FaShare } from 'react-icons/fa';
import { getFirestore, updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { ImSpinner2 } from 'react-icons/im';

function VideoCard({ video, videos }) {
  const db = getFirestore();
  const user = useSelector((state) => state.user.user);
  const [commentText, setCommentText] = useState('');
  const [videoData, setVideoData] = useState(video); 
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    const postRef = doc(db, 'postedVideos', videoData.id);
    const hasLiked = videoData.likedBy?.includes(user.uid);
  
    // Ensure postLikes is a number and likedBy is an array
    const currentLikes = videoData.postLikes || 0;
    const currentLikedBy = Array.isArray(videoData.likedBy) ? videoData.likedBy : [];
  
    try {
      if (hasLiked) {
        await updateDoc(postRef, {
          postLikes: currentLikes - 1,
          likedBy: arrayRemove(user.uid),
        });
        setVideoData((prevData) => ({
          ...prevData,
          postLikes: currentLikes - 1,
          likedBy: prevData.likedBy.filter((uid) => uid !== user.uid), // Ensure prevData.likedBy is an array
        }));
      } else {
        await updateDoc(postRef, {
          postLikes: currentLikes + 1,
          likedBy: arrayUnion(user.uid),
        });
        setVideoData((prevData) => ({
          ...prevData,
          postLikes: currentLikes + 1,
          likedBy: [...currentLikedBy, user.uid], // Use currentLikedBy to ensure it's an array
        }));
      }
    } catch (error) {
      console.error('Error updating likes:', error.message);
    } finally {
      setIsLiking(false);
    }
  };
  

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText) {
        return;
    }
    setIsCommenting(true); 
    const postRef = doc(db, 'postedVideos', video.id);
    const newComment = {
        text: commentText,
        timestamp: new Date(),
        commenterPhotoUrl: user.photoURL,
        commentDisplayName: user.displayName,
    };

    try {
        await updateDoc(postRef, {
            postComments: arrayUnion(newComment),
        });
        setVideoData(prevData => ({
            ...prevData,
            postComments: [...(prevData.postComments || []), newComment]
        }));
        setCommentText('');
    } catch (error) {
        console.error('Failed to post comment', error.message);
    } finally {
        setIsCommenting(false); e
    }
  };

  return (
    <div className="bg-white shadow-xl border rounded-lg mb-4 w-full flex flex-col laptop:w-[70%]">
      <div className="flex items-center p-2">
        <img
          src={video.userPhoto}
          alt={video.userName}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h3 className="font-bold">{video.userName}</h3>
        </div>
      </div>
      <div className='pl-2'>
        <p className="text-lg">{video.title}</p>
      </div>
      <div className="video-container">
        <video className="w-full h-[30vh] tablet:h-[40vh] laptop:h-[60vh] bg-black" controls>
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className='p-2 flex justify-between'>
        <ul className='flex space-x-4'>
          <li
            className={`hover:bg-gray-100 p-1 cursor-pointer rounded-md space-x-1 flex justify-center items-center ${videoData.likedBy?.includes(user.uid) ? 'text-blue-600' : ''}`}
            onClick={handleLike}
          >
            {isLiking ? (
              <ImSpinner2 className="animate-spin" />
            ) : (
              <>
                <FaRegThumbsUp />
                <button className='text-sm'>Like</button>
              </>
            )}
          </li>
          <li className='hover:bg-gray-100 hidden p-1 cursor-pointer rounded-md space-x-1 phone:flex justify-center items-center'>
            {isCommenting ? (
              <ImSpinner2 className="animate-spin" />
            ) : (
              <>
                <FaRegComment />
                <button className='text-sm'>Comment</button>
              </>
            )}
          </li>
          <li className='hover:bg-gray-100 hidden p-1 cursor-pointer rounded-md space-x-1 phone:flex justify-center items-center'>
            <FaShare />
            <button className='text-sm'>Share</button>
          </li>
        </ul>
        <ul className='flex space-x-2'>
          <li>{videoData.postLikes || 0} Likes</li>
          <li>{videoData.postComments?.length || 0} Comments</li>
        </ul>
      </div>
      <div className='p-2'>
        <form onSubmit={handleSubmitComment} className='flex space-x-2'>
          <img src={user.photoURL} alt="User Avatar" className='w-8 h-8 rounded-full' />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg'
          />
          <button type="submit" className='bg-blue-600 hidden phone:flex text-white px-4 py-2 rounded-lg'>
            Post
          </button>
        </form>
        <div className='mt-2  p-1 overflow-y-scroll max-h-[20vh]'>
          {videoData.postComments?.map((comment, index) => (
            <div key={index} className='flex items-start space-x-2 mb-2 '>
              <img src={comment.commenterPhotoUrl} className='w-8 h-8 rounded-full' alt="Commenter" />
              <div className='bg-gray-100 p-2 rounded-lg flex-1 w-[20%]'>
                <h4 className='font-bold'>{comment.commentDisplayName}</h4>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
