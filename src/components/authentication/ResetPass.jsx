import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../features/user/UserSlice';

function ResetPass() {
    const emailRef = useRef();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const dispatch = useDispatch();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setShowMessage(false);

        try {
            await dispatch(resetPassword({ email: emailRef.current.value })).unwrap();
            setShowMessage(true);
        } catch (error) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen grid place-content-center bg-gray-100'>
            <div className='text-center text-blue-600 text-4xl font-extrabold my-2'>
                <h1>Facebook</h1>
            </div>

            {showMessage ? (
                <div className='bg-white p-5 shadow-lg rounded-md text-center'>
                    <h1 className='text-2xl my-2'>Password Reset</h1>
                    <p className='text-green-500'>An email has been sent to <span>{emailRef.current.value}</span> to reset your password.</p>



                    <button
                            type='submit'
                            className={`p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white`}
                        >
                           Back to login
                        </button>
                </div>
                
            ) : (
                <div className='bg-white p-5 shadow-lg rounded-md text-center'>
                    <h1 className='text-2xl my-2'>Reset Your Password</h1>
                    <form onSubmit={handleResetPassword} className='flex flex-col space-y-2'>
                        <input
                            ref={emailRef}
                            className='w-80 outline-none p-2 border-[1px] border-gray-300 rounded-md'
                            type="email"
                            placeholder='Enter your email'
                        />
                        <button
                            type='submit'
                            className={`p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Reset Password'}
                        </button>
                    </form>
                    {error && <div className='text-red-500 mt-2'>{error}</div>}
                </div>
            )}
        </div>
    );
}

export default ResetPass;
