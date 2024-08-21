import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserProfileModal from '../modals/UserProfileModal';
import { Link } from 'react-router-dom';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { auth } from '../../firebase/firebase';
import { setUser } from '../../features/user/UserSlice';

function UserProfile() {
    const db = getFirestore();
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    const user = useSelector((state) => state.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBioBox, setOpenBioBox] = useState(false);
    const [bioText, setBioText] = useState('');
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
    const placeholderCoverImage = 'https://via.placeholder.com/800x400.png?text=Cover+Photo';

    useEffect(() => {
        console.log('Current User:', user);
    }, [user]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const toggleBioBox = () => {
        setOpenBioBox(prev => !prev);
    };

    const handleAddBio = async (e) => {
        e.preventDefault();
        const userId = auth.currentUser.uid;
        const userDoc = doc(db, 'users', userId);
        try {
            await updateDoc(userDoc, {
                userBio: bioText
            });
            dispatch(setUser({
                ...user,
                userBio: bioText
            }));
            console.log('Bio updated successfully');
            setBioText('');
            setOpenBioBox(false);
        } catch (error) {
            console.log('Could not add bio', error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Cover Photo */}
            <div className="relative h-96 bg-gray-300 rounded-lg">
                <img
                    src={user.coverURL || placeholderCoverImage}
                    alt=""
                    className="object-cover w-full h-full rounded-lg"
                />
                {/* Profile Photo and User Info */}
                <div className="absolute -bottom-12 sm:-bottom-28 left-8 flex items-center space-x-4">
                    <img
                        src={user.photoURL || placeholderImage}
                        alt="Profile"
                        className="h-24 sm:h-32 md:h-40 w-24 sm:w-32 md:w-40 rounded-full border-4 border-white"
                    />
                </div>
                <div className='absolute -bottom-[3rem] left-[10rem]'>

                    <h1 className="text-xl font-bold">{user.displayName}</h1>
                </div>
            </div>
            <UserProfileModal isOpen={isModalOpen} onClose={closeModal} user={user} />
            {/* Profile Navigation */}
            <div className='mt-[3.1rem] flex justify-end p-4'>
                <button onClick={openModal} className='bg-blue-500 hover:bg-blue-600 font-semibold text-white rounded-lg p-3'>Edit Profile</button>
            </div>
            <div className="mt-8 flex justify-center space-x-8 border-b-2 border-gray-200 pb-2">
                {/* Navigation buttons */}
            </div>

            <div className="flex  mt-4 p-2 flex-col laptop:flex-row space-y-4 space-x-2">
                <div className="shadow-lg space-y-6 ">
                    {/* Intro Section */}
                    <div className="p-4 bg-white rounded-md shadow-lg">
                        <h2 className="font-semibold text-lg mb-3">Intro</h2>
                        <h1>{user.userBio || 'No bio available'}</h1>
                        <div className="space-y-2 text-gray-600">
                            {!openBioBox && <button
                                onClick={toggleBioBox}
                                className='bg-gray-200 hover:bg-gray-300 font-semibold w-full p-2 rounded-lg'>
                                Add Bio
                            </button>}

                            {openBioBox && (
                                <form className='text-start max-h-52'>
                                    <textarea
                                        value={bioText}
                                        onChange={(e) => setBioText(e.target.value)}
                                        cols={2}
                                        type="text"
                                        className='max-h-52 h-16 justify-start text-start w-full p-2 bg-gray-100 rounded-md border'
                                        placeholder='Describe Who you are'
                                    />
                                    <div className='text-end'>
                                        <button
                                            type="button"
                                            className='p-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded-lg'
                                            onClick={toggleBioBox}>
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddBio}
                                            type="submit"
                                            className='p-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded-lg'>
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Friends Section */}
                    <div className="p-4 bg-white rounded-md shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold text-lg">Friends</h2>
                            <Link className="text-blue-500">See All Friends</Link>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {user.allfriends ?
                                user.allfriends.map((friend, index) => (
                                    <div key={index} className="text-center">
                                        <img src={friend.photoURL} alt={friend.displayName} className="w-full h-24 object-cover rounded-md" />
                                        <p className="text-sm">{friend.displayName}</p>
                                    </div>
                                ))
                                :
                                <h1>No friends to show</h1>
                            }
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-full h-full">
                    {/* Posts Section */}
                    <div id="posts" className="bg-white p-4 rounded-md shadow-lg">
                        <h2 className="font-semibold text-lg mb-3">Posts</h2>
                        <h1>No posts to show</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
