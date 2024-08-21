import React from 'react';
import { FaHome, FaFilm, } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {BiVideoPlus} from 'react-icons/bi'
function VideoSideBar() {
    return (
        <div className="w-1/5 p-4 text-lg border-r laptop:flex laptop:flex-col hidden ">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Video</h2>
                <button className="text-gray-500 focus:outline-none">
                    <AiFillSetting size={20} />
                </button>
            </div>
            <div className="flex items-center mb-4">
                <FiSearch className="text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search videos"
                    className="w-full p-2 rounded bg-white focus:outline-none"
                />
            </div>
            <ul className='space-y-1 text-lg font-semibold'>
                <Link to='' className="flex items-center py-2 px-4 hover:bg-gray-100 bg-opacity-40 rounded-xl cursor-pointer">
                    <FaHome size={25} className="mr-3 text-blue-500" />
                    Home
                </Link>

                <li className="flex items-center py-2 px-4 hover:bg-gray-100 bg-opacity-40 rounded-xl cursor-pointer">
                    <FaFilm size={25} className="mr-3 text-gray-500" />
                    Reels
                </li>


                <Link to='uploadVideo' className="flex items-center py-2 px-4 hover:bg-gray-100 bg-opacity-40 rounded-xl cursor-pointer">


                    <BiVideoPlus  size={25} className="mr-3 text-gray-500" />
                    Create 
                </Link>
                {/* </li> */}
            </ul>
        </div>
    );
}

export default VideoSideBar;
