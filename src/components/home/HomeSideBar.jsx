import React, { useEffect, useState } from 'react';
import { FaUser, FaUserFriends, FaRegClock, FaBookmark, FaRegListAlt, FaVideo, FaStore, FaRss } from 'react-icons/fa';
import '../../App.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase/firebase';

function HomeSideBar() {
    const user = useSelector((state) => state.user.user);
    // console.log(user)

   
    

    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';

    return (
        <div className=' h-[89.5vh] py-3 overflow-y-scroll scrollbar hidden tablet:flex'>
            <ul className='ml-2 space-y-3'>
                <Link to='/userProfile' className='flex items-center text-lg hover:bg-gray-100 p-2 rounded-md cursor-pointer font-semibold'>
                    <img 
                        src={user.photoURL || placeholderImage} 
                        alt="Profile" 
                        className='w-[31px] h-[31px] rounded-full cursor-pointer mr-2' 
                    />
                    <h1> {user ? user.displayName : 'Loading...'}</h1>
                </Link>
                <Link className='flex items-center text-lg hover:bg-gray-100 p-2 rounded-md cursor-pointer font-semibold'>
                    <FaUserFriends size={23} className='mr-2 text-blue-600' />
                    <h1>Friends</h1>
                </Link>
                <Link className='flex items-center text-lg hover:bg-gray-100 p-2 rounded-md cursor-pointer font-semibold'>
                    <FaRegClock size={23} className='mr-2 text-blue-600' />
                    <h1>Memories</h1>
                </Link>
                <Link className='flex items-center text-lg hover:bg-gray-100 p-2 rounded-md cursor-pointer font-semibold'>
                    <FaBookmark size={23} className='mr-2 text-blue-600' />
                    <h1>Saved</h1>
                </Link>
                <Link className='flex items-center text-lg hover:bg-gray-100 p-2 rounded-md cursor-pointer font-semibold'>
                    <FaRegListAlt size={23} className='mr-2 text-blue-600' />
                    <h1>Groups</h1>
                </Link>
                <Link className='flex items-center text-lg hover:bg-gray-100 p-2 rounded-md cursor-pointer font-semibold'>
                    <FaVideo size={23} className='mr-2 text-blue-600' />
                    <h1>Videos</h1>
                </Link>
                <Link className='flex items-center text-lg hover:bg-gray-100 p-2 rounded-md cursor-pointer font-semibold'>
                    <FaStore size={23} className='mr-2 text-blue-600' />
                    <h1>MarketPlace</h1>
                </Link>
                <Link className='flex items-center text-lg hover:bg-gray-100 p-2 rounded-md cursor-pointer font-semibold'>
                    <FaRss size={23} className='mr-2 text-blue-600' />
                    <h1>Feeds</h1>
                </Link>
            </ul>
        </div>
    );
}

export default HomeSideBar;
