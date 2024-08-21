import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function UplaodVideo() {
    const [showModal, setShowModal] = useState(false);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();

    const handleUpload = async () => {
        if (!videoTitle || !videoFile) {
            alert("Please provide a video title and select a video file.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                alert("You need to be logged in to upload a video.");
                return;
            }

            setUploading(true);

            // Create a reference to the storage location
            const storageRef = ref(storage, `videos/${videoFile.name}`);

            // Upload the file
            const uploadTask = uploadBytesResumable(storageRef, videoFile);

            // Listen for state changes, errors, and completion
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // You can use this to display upload progress if needed
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                    console.error('Upload failed:', error);
                    setUploading(false);
                    alert('Error uploading video.');
                }, 
                async () => {
                    // Handle successful uploads on complete
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);

                    // Save video metadata to Firestore
                    await addDoc(collection(db, 'postedVideos'), {
                        title: videoTitle,
                        videoUrl: downloadURL, 
                        userId: user.uid,
                        userPhoto: user.photoURL || '', 
                        userName: user.displayName || '',
                        timestamp: new Date(),
                    });

                    // Reset state and close modal
                    setVideoTitle('');
                    setVideoFile(null);
                    setShowModal(false);
                    setUploading(false);

                    alert("Video uploaded successfully!");
                }
            );

        } catch (e) {
            console.error("Error adding document: ", e);
            setUploading(false);
            alert("Error uploading video.");
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-[80vh]">
            <div className='flex items-center justify-center'>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => setShowModal(true)}
                >
                    Post Video
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
                        <div className='flex justify-between items-center text-center w-full p-2'>
                            <h2 className="text-2xl">Upload Video</h2>
                            <button 
                                className='hover:bg-gray-100 p-2 rounded-full w-10 h-10 flex items-center justify-center'
                                onClick={() => setShowModal(false)}
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className='border-b my-2 border-gray-400'></div>
                        <div className='mt-5'>
                            <input
                                type="text"
                                placeholder="Enter video title"
                                className="w-full p-2 mb-4 border rounded"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                            />
                            <input
                                type="file"
                                accept="video/*"
                                className="mb-4"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UplaodVideo;
