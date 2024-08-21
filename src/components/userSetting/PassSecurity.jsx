import React, { useRef, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { auth } from '../../firebase/firebase';
import { reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { FaSpinner } from 'react-icons/fa';
import { EmailAuthProvider } from 'firebase/auth/web-extension';

function PassSecurity() {
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();
    const newConfirmPasswordRef = useRef();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const [successMsj, setSuccessMsj] = useState('')
    const [error, setError] = useState('')

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(prevState => !prevState);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(prevState => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevState => !prevState);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        const currentPassword = currentPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;
        const newConfirmPassword = newConfirmPasswordRef.current.value;

        if (newPassword !== newConfirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
            
            setSuccessMsj('Your password was changed successfully!');
            setTimeout(() => setSuccessMsj(''), 5000); // Hide success message after 5 seconds

            currentPasswordRef.current.value = '';
            newPasswordRef.current.value = '';
            newConfirmPasswordRef.current.value = '';

        } catch (error) {
            setError('Incorrect current password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex w-[80%] items-center justify-center bg-[#142747] text-white'>
            <div className='relative w-[40%] h-[70vh] rounded-xl bg-[#203a6fde] flex flex-col justify-start p-5 space-y-4'>
                <h1 className='text-2xl mb-4'>Change your password</h1>
            <p>To change your password you need to enter your current password. This is for your security. It makes sure that it is really you who is changing password</p>
                {/* Current Password Input */}
                <div className='relative'>
                    <input
                        onChange={() => { setError('') }}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className='w-full rounded-xl bg-[#142747] border-gray-500 border-[1px] p-2 pr-10 outline-none text-xl'
                        placeholder='Current Password'
                        ref={currentPasswordRef}
                    />
                    <button
                        type="button"
                        onClick={toggleCurrentPasswordVisibility}
                        className="absolute inset-y-0 right-2 flex items-center px-2"
                    >
                        {showCurrentPassword ? (
                            <AiFillEyeInvisible className="h-5 w-5 text-gray-500" />
                        ) : (
                            <AiFillEye className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                </div>

                {/* New Password Input */}
                <div className='relative'>
                    <input
                        onChange={() => { setError('') }}
                        type={showNewPassword ? 'text' : 'password'}
                        className='w-full rounded-xl bg-[#142747] border-gray-500 border-[1px] p-2 pr-10 outline-none text-xl'
                        placeholder='New Password'
                        ref={newPasswordRef}
                    />
                    <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute inset-y-0 right-2 flex items-center px-2"
                    >
                        {showNewPassword ? (
                            <AiFillEyeInvisible className="h-5 w-5 text-gray-500" />
                        ) : (
                            <AiFillEye className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                </div>

                {/* Confirm New Password Input */}
                <div className='relative'>
                    <input
                        onChange={() => { setError('') }}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className='w-full rounded-xl bg-[#142747] border-gray-500 border-[1px] p-2 pr-10 outline-none text-xl'
                        placeholder='Confirm New Password'
                        ref={newConfirmPasswordRef}
                    />
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-2 flex items-center px-2"
                    >
                        {showConfirmPassword ? (
                            <AiFillEyeInvisible className="h-5 w-5 text-gray-500" />
                        ) : (
                            <AiFillEye className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                </div>

                <button
                    disabled={loading}
                    onClick={handleUpdatePassword}
                    type="submit"
                    className='mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-xl flex items-center justify-center'
                >
                    {loading ? (
                        <FaSpinner className="h-5 w-5 animate-spin" />
                    ) : (
                        'Update password'
                    )}
                </button>

                {error && <h1>{error}</h1>}
                {successMsj && <h1>{successMsj}</h1>}
            </div>
        </div>
    );
}

export default PassSecurity;
