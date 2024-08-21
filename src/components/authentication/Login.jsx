import React, { useRef, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { logIn, setUser } from '../../features/user/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };
    const handleLoginUser = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Dispatch the login action with user details
        dispatch(logIn({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL:user.photoURL,
            coverURL:user.coverURL,

        }));

        // Set user in state
        dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL:user.photoURL,
            coverURL:user.coverURL,

        }));

        console.log('Login successful');
        navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
            emailRef.current.value = '';
            passwordRef.current.value = '';
        }
    };

    return (
        <div className='w-full h-screen grid place-content-center bg-gray-100'>
            <div className='text-center text-blue-600 text-4xl font-extrabold my-2'>
                <h1>Facebook</h1>
            </div>

            <div className='bg-white p-5 shadow-lg rounded-md text-center'>
                <h1 className='text-2xl my-2'>Login to Facebook</h1>
                <form onSubmit={handleLoginUser} className=' relative flex flex-col space-y-2'>
                    <input
                        ref={emailRef}
                        className='w-80 outline-none p-2 border-[1px] border-gray-300 rounded-md'
                        type="text"
                        placeholder='Enter email or phone number'
                    />
                    <input
                        ref={passwordRef}
                        className='w-80 outline-none p-2 border-[1px] border-gray-300 rounded-md'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                    />
                      <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute top-[53px] right-0 flex items-center px-2"
                                >
                                    {showPassword ? (
                                        <AiFillEyeInvisible className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <AiFillEye className="h-6 w-6 text-gray-500" />
                                    )}
                                </button>
                    <button
                        type='submit'
                        className={`p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Log In'}
                    </button>
                </form>
                {error && <div className='text-red-500 mt-2'>{error}</div>}
                <Link to='/resetPass' className='text-blue-500 hover:underline cursor-pointer block mt-[1.5rem]'>Forgotten account?</Link>
                <div className="flex items-center justify-center my-2">
                    <div className="w-full h-px bg-gray-300"></div>
                    <span className="px-4 text-gray-400">or</span>
                    <div className="w-full h-px bg-gray-300"></div>
                </div>
                <Link to='/signUp' className='bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white font-bold w-40'>Sign Up</Link>
            </div>
        </div>
    );
}

export default Login;
