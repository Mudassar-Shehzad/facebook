import React, { useEffect, useState } from 'react';
import { FaComment, FaRegThumbsUp, FaShare, FaSmile, FaImage, FaThumbsUp, FaRegComment, FaShareAlt } from 'react-icons/fa';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import PostModal from '../modals/PostModal';
import Posts from '../posts/posts';
import { useSelector } from 'react-redux';

function HomeMiddle() {

    const user = useSelector((state) => state.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);





    return (
        <div className='flex flex-col space-y-5 pt-10 laptop:w-[40%] tablet:w-[70%] h-[89.5vh] overflow-y-auto'>
            <div className='bg-white p-4 rounded-md'>
                <div className='flex items-center mb-4'>
                    <img
                        src={user.photoURL || placeholderImage}
                        alt="User Profile"
                        className='w-12 h-12 rounded-full mr-3'
                    />
                    <input
                        onClick={openModal}
                        placeholder={`What's on your mind, ${user.displayName}?`}
                        className='w-[88%] placeholder:text-gray-700 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 outline-none'
                        readOnly
                    />
                </div>
                <div className='flex justify-between'>
                    <button className='flex items-center text-blue-500'>
                        <FaImage className='mr-1' />
                        Photo/Video
                    </button>
                    <button className='flex items-center text-yellow-500'>
                        <FaSmile className='mr-1' />
                        Feeling/Activity
                    </button>
                </div>
            </div>
            <PostModal isOpen={isModalOpen} onClose={closeModal} user={user} />
            <Posts />
        </div>
    );
}

export default HomeMiddle;
