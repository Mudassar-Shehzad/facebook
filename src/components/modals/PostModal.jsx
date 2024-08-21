import { getFirestore, collection, addDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../../firebase/firebase'; 
import { Timestamp } from 'firebase/firestore';

function PostModal({ isOpen, onClose }) {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const user = useSelector((state) => state.user.user);
    // const [postUrl, setPostUrl] = useState('');
    const [postText, setPostText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]); 
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const db = getFirestore();

    const handlePost = async () => {
        setLoading(true)
        try {
            // console.log(loading && 'loading1')
            let downloadURL = '';
    
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error('User is not authenticated');
            }
            // console.log(loading && 'loading2')

            if (imageFile) {
                const storage = getStorage();
                const userUid = currentUser.uid;
                const postImageRef = ref(storage, `profileImages/${userUid}/${Date.now()}_${imageFile.name}`);
    
                await uploadBytes(postImageRef, imageFile);
    
                downloadURL = await getDownloadURL(postImageRef);
                console.log('Download URL:', downloadURL); 
                // setPostUrl(downloadURL); 
            }
            console.log(loading && 'loading3')

            const postCollection = collection(db, 'allPosts');
            const docRef = await addDoc(postCollection, {
                postOwner: user,
                postUrl: downloadURL,
                postText: postText,
                postLikes: 0,
                likedBy: [], 
                postComments: {},
                commentarDiplayName: '',
                commenterUid:'',
                commenterPhotoUrl:'',
                createdAt: Timestamp.now(),
            });
            // console.log(loading && 'loading4')

            // console.log('Added the post to', docRef.id);
            onClose();

        } catch (error) {
            setError(`Failed to post: ${error.message}`);
            // console.log('Error adding post:', error);
        }

        setLoading(false)
        // window.location.reload(); 
        // console.log('completer')
        setPostText('');

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
                <h2 className="text-xl font-semibold mb-4 text-center">Create Post</h2>
                <div className="flex items-center mb-4">
                    <img
                        src={user.photoURL || placeholderImage}
                        alt="User"
                        className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                        <p className="font-semibold text-xl">{user.displayName}</p>
                    </div>
                </div>
                <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder={`What's on your mind, ${user.displayName}?`}
                    className="w-full border rounded-lg p-2 mb-4"
                ></textarea>

                {/* Image Preview */}
                {image && (
                    <div className="mb-4">
                        <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                )}

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-gray-500 font-medium mb-2">
                        Upload Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <button
                    onClick={handlePost}
                    className={`bg-blue-500 text-white w-full px-4 py-2 rounded ${loading ?'cursor-not-allowed hover:bg-blue-400 bg-blue-400'  : ' hover:bg-blue-700 bg-blue-500'}`}
                    disabled={loading}
                >
                    {loading ?'Posting' : 'Post'}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
}

export default PostModal;
