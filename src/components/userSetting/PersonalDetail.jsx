import React, { useRef, useState } from 'react';
import { FaEdit, FaCheck } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../../firebase/firebase';
import { reauthenticateWithCredential, updateEmail, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { setUser } from '../../features/user/UserSlice';
import { EmailAuthProvider } from 'firebase/auth';

const db = getFirestore();

function PersonalDetail() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const [isUserNameEditing, setUserNameIsEditing] = useState(false);
    const [isEmailEditing, setIsEmailEditing] = useState(false);
    const [username, setUserName] = useState(user.displayName);
    const [useremail, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const userNameInputRef = useRef(null);
    const emailInputRef = useRef(null);

    const handleUserNameClick = async () => {
        if (isUserNameEditing) {
            const userUid = auth.currentUser.uid;
            await updateProfile(auth.currentUser, { displayName: username });
            const userDocRef = doc(db, "users", userUid);
            await updateDoc(userDocRef, { displayName: username });

            dispatch(setUser({
                ...user,
                displayName: username,
            }));
        } else {
            userNameInputRef.current.focus();
        }
        setUserNameIsEditing(!isUserNameEditing);
    };

    const handleEmailClick = async () => {
        try {
            if (isEmailEditing) {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    throw new Error('No user is currently signed in.');
                }
    
                const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);
    
                // Send verification email
    
                // Notify user to check their email
                alert('A verification email has been sent to your new email address. Please verify it before updating your email.');
    
                // You may want to add logic here to check whether the email has been verified before updating it
                // This could be a separate flow after user confirms the verification email
            } else {
                emailInputRef.current.focus();
            }
        } catch (error) {
            console.error('Error updating email:', error);
        } finally {
            setIsEmailEditing(!isEmailEditing);
        }
    };
    
    return (
        <div className='flex w-[80%] items-center justify-center bg-[#142747] text-white'>
            <div className='w-[40%] h-[70vh] rounded-xl bg-[#203a6fde] flex justify-start flex-col space-y-3 p-5'>
                <h1 className='text-2xl'>Username:</h1>
                <div className='relative w-full'>
                    <input
                        ref={userNameInputRef}
                        type="text"
                        className={`w-full h-[8vh] rounded-xl bg-[#203a6fde] border-gray-500 border-[1px] p-2 pr-12 outline-none text-xl ${isUserNameEditing ? 'border-blue-500' : 'border-transparent'}`}
                        onChange={(e) => setUserName(e.target.value)}
                        value={username}
                        readOnly={!isUserNameEditing}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-6 transform -translate-y-1/2 p-2 rounded-full text-[#fff] flex items-center justify-center"
                        onClick={handleUserNameClick}
                    >
                        {isUserNameEditing ? <FaCheck className="h-5 w-5" /> : <FaEdit className="h-5 w-5" />}
                    </button>
                </div>
                <h1 className='text-2xl'>Email: </h1>
                <div className='relative w-full'>
                    <input
                        ref={emailInputRef}
                        type="text"
                        className={`w-full h-[8vh] rounded-xl bg-[#203a6fde] border-gray-500 border-[1px] p-2 pr-12 outline-none text-xl ${isEmailEditing ? 'border-blue-500' : 'border-transparent'}`}
                        onChange={(e) => setEmail(e.target.value)}
                        value={useremail}
                        readOnly={!isEmailEditing}
                    />
                    {isEmailEditing && (
                        <input
                            type="password"
                            placeholder="Current Password"
                            className="w-full h-[8vh] rounded-xl bg-[#203a6fde] border-gray-500 border-[1px] p-2 pr-12 outline-none text-xl"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            value={currentPassword}
                        />
                    )}
                    <button
                        type="button"
                        className="absolute right-2 top-6 transform -translate-y-1/2 p-2 rounded-full text-[#fff] flex items-center justify-center"
                        onClick={handleEmailClick}
                    >
                        {isEmailEditing ? <FaCheck className="h-5 w-5" /> : <FaEdit className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PersonalDetail;
