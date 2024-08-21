import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, signUp } from '../../features/user/UserSlice';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom'
function Signup() {
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); 
    const dispatch = useDispatch();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate()
    const userPhotoURL =  useSelector((state) => state.user.userPhotoURL)
    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSignUpUser = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (firstNameRef.current.value === '' ||
            lastNameRef.current.value === '' ||
            emailRef.current.value === '' ||
            passwordRef.current.value === '') {
            setLoading(false);
            setError('Please fill in all the fields');
            return;
        }

        const email = emailRef.current.value;
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Invalid email address');
            setLoading(false);
            return;
        }
        try {
            const resultAction = await dispatch(signUp({
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                email: email,
                password: passwordRef.current.value,
                PhotoURL:userPhotoURL,
            }));
            // console.log(resultAction)

            dispatch(setUser(resultAction.payload));

            firstNameRef.current.value = '';
            lastNameRef.current.value = '';
            emailRef.current.value = '';
            passwordRef.current.value = '';

            navigate('/');


        } catch (error) {
            console.error('Sign-up error:', error);
            setError('An error occurred during sign up');
        }

        setLoading(false);
    };

    return (
        <div className='w-full h-screen grid place-content-center bg-gray-100'>
            <div className='text-center text-blue-600 text-4xl font-extrabold my-2'>
                <h1>Facebook</h1>
            </div>
            <form onSubmit={handleSignUpUser}>
                <div className='bg-white p-5 shadow-lg rounded-md'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold'>Create a new account</h1>
                        <h1>It's quick and easy</h1>
                    </div>
                    <div className='border-t-gray-400 border-[0.5px] my-3'></div>
                    <div className='my-4'>
                        <div className='space-x-2 my-4'>
                            <input ref={firstNameRef} type="text" className='p-2 border-[1px] border-gray-400 rounded-md' placeholder='First name' />
                            <input ref={lastNameRef} type="text" className='p-2 border-[1px] border-gray-400 rounded-md' placeholder='Last name' />
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <input type='email' ref={emailRef} className='p-2 border-[1px] border-gray-400 rounded-md' placeholder='Mobile number or Email address' />
                            <div className='relative'>
                                <input
                                    ref={passwordRef}
                                    className="p-2 border-[1px] border-gray-400 rounded-md w-full pr-10"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center px-2"
                                >
                                    {showPassword ? (
                                        <AiFillEyeInvisible className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <AiFillEye className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && <div className='text-red-500 text-center my-4'>{error}</div>}
                        <div className='text-center my-4 flex justify-center'>
                            <button
                                type='submit'
                                className={`w-40 p-3 bg-blue-600 rounded-md font-bold text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <FaSpinner className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        </div>
                        <div className="flex items-center justify-center my-2">
                            <div className="w-full h-px bg-gray-300"></div>
                            <span className="px-4 text-gray-400">or</span>
                            <div className="w-full h-px bg-gray-300"></div>
                        </div>
                        <div className='text-center flex justify-center py-2 '>

                            <Link to='/login' className='w-52 bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white font-bold '>Log in</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Signup;
