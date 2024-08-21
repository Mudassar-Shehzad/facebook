import React from 'react';
import { Outlet } from 'react-router-dom';
import VideoSideBar from './VideoSideBar';
import VideoDisplay from './VideoDisplay';
import { useSelector } from 'react-redux';
import Login from '../../authentication/Login';

function VideoHome() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) {
    return (
      <div className="flex w-full">
        <VideoSideBar />
        <Outlet /> 
      </div>
    );
  }
  return <Login />;
}

export default VideoHome;
