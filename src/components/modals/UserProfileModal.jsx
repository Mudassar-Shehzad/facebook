import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setUser, setUserPhotoURL } from '../../features/user/UserSlice'; // Adjust the path as needed
import { auth } from '../../firebase/firebase'; // Adjust the path as needed
import { doc, getFirestore, updateDoc } from 'firebase/firestore';

function UserProfileModal({ isOpen, onClose }) {
    const db = getFirestore();

    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const profileFileInputRef = useRef(null);
    const coverFileInputRef = useRef(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
    const placeholderCoverImage = 'https://via.placeholder.com/800x400.png?text=Cover+Photo';

    const handleImageChange = (e, setImage) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleEditClick = (e, type) => {
        e.preventDefault();
        if (type === 'profile' && profileFileInputRef.current) {
            profileFileInputRef.current.click();
        } else if (type === 'cover' && coverFileInputRef.current) {
            coverFileInputRef.current.click();
        }
    };

    const handlePost = async () => {
        if (!profileImage && !coverImage) {
            onClose();
            return;
        }

        setLoading(true);

        const storage = getStorage();
        const userUid = auth.currentUser.uid;
        const profileImageRef = ref(storage, `profileImages/${userUid}`);
        const coverImageRef = ref(storage, `coverImages/${userUid}`);

        try {
            let profileImageUrl = user.photoURL || placeholderImage;
            let coverImageUrl = user.coverURL || placeholderCoverImage;

            if (profileImage) {
                await uploadBytes(profileImageRef, profileImage);
                profileImageUrl = await getDownloadURL(profileImageRef);
            }

            if (coverImage) {
                await uploadBytes(coverImageRef, coverImage);
                coverImageUrl = await getDownloadURL(coverImageRef);
            }

            await updateProfile(auth.currentUser, {
                photoURL: profileImageUrl,
                displayName: `${user.displayName}`,
            });
            // dispatch(setUserPhotoURL(profileImageUrl))
            const userDocRef = doc(db, "users", userUid); // Assuming "users" collection and userUid is the document ID
            await updateDoc(userDocRef, {
                photoURL: profileImageUrl,
                coverURL: coverImageUrl
            });
    
            dispatch(setUser({
                ...user,
                photoURL: profileImageUrl,
                coverURL: coverImageUrl
            }));

            onClose(); 
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false); 
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center">Update Profile</h2>

                {/* Profile Image Upload */}
                <div className="mb-4">
                    <div className='flex justify-between px-1 py-2'>
                        <h2 className='text-2xl'>Profile Picture</h2>
                        <button
                            className='text-blue-600 hover:underline'
                            onClick={(e) => handleEditClick(e, 'profile')}
                        >
                            Edit
                        </button>
                    </div>
                    <div className='flex items-center justify-center my-2'>
                        <img
                            src={profileImage ? URL.createObjectURL(profileImage) : user.photoURL || placeholderImage}
                            alt="Profile Photo"
                            className="h-24 sm:h-32 md:h-40 w-24 sm:w-32 md:w-40 rounded-full"
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setProfileImage)}
                        className="hidden"
                        ref={profileFileInputRef}
                    />
                </div>

                {/* Cover Image Upload */}
                <div className="mb-4">
                    <div className='flex justify-between px-1 py-2'>
                        <h2 className='text-2xl'>Cover Photo</h2>
                        <button
                            className='text-blue-600 hover:underline'
                            onClick={(e) => handleEditClick(e, 'cover')}
                        >
                            Edit
                        </button>
                    </div>
                    <div className='flex items-center justify-center my-2'>
                        <img
                            src={coverImage ? URL.createObjectURL(coverImage) : user.coverURL || placeholderCoverImage}
                            alt="Cover Photo"
                            className="h-40 w-full rounded-lg "
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setCoverImage)}
                        className="hidden"
                        ref={coverFileInputRef}
                    />
                </div>

                <button
                    onClick={handlePost}
                    className={`bg-blue-500 text-white w-full px-4 py-2 rounded ${loading ? 'bg-blue-300 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Post'}
                </button>
            </div>
        </div>
    );
}

export default UserProfileModal;
