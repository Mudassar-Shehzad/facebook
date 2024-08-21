import React, { useEffect, useState } from 'react';
import VideoCard from './VideoCard';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
const db = getFirestore()
function VideoDisplay() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'postedVideos'));
        const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="laptop:w-[80%] w-full p-4 h-[88vh] overflow-y-scroll flex flex-col laptop:items-center">
      {
        videos?.length > 0 ?
      videos.map((video) => (
        <VideoCard key={video.id} video={video} videos={videos} />
      )):
      <div className="flex  justify-center">
        <h1>No videos to show</h1>
      </div>
    }
    </div>
  );
}

export default VideoDisplay;
