import React, { useRef, useState } from 'react';
import { FaFacebook, FaSearch, FaHome, FaUserFriends, FaVideo, FaFacebookMessenger, FaBell, FaBars, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import '../../App.css'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearUser, getAllUsers, getUserByDisplayName, setShowMenu, setshowMessangerModal } from '../../features/user/UserSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import Login from '../authentication/Login';
import NotificationModal from './navbarModals/notificationModal';
import MessengerModal from './navbarModals/MessengerModal'
import MenuModal from './navbarModals/MenuModal';
function Navbar() {
    const showMessangerModal = useSelector((state) => state.user.showMessangerModal)
    const showMenu = useSelector((state) => state.user.showMenu)
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
    const [isBoxVisible, setIsBoxVisible] = useState(false);
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [isMessengerVisible, setIsMessengerVisible] = useState(showMessangerModal);
    const [openSearchModal, setOpenSearchModal] = useState(false)

    const toggleBoxVisibility = () => {
        setIsBoxVisible(!isBoxVisible);
        dispatch(setshowMessangerModal(true ? false : false))
        setIsNotificationVisible(true ? false : false);
        dispatch(setShowMenu(false))


    };
    const toggleNotificationVisibility = () => {
        setIsMessengerVisible(!isMessengerVisible);
        setIsNotificationVisible(!isNotificationVisible);
        dispatch(setshowMessangerModal(true ? false : false))
        dispatch(setShowMenu(true ? false : false))
        setIsBoxVisible(true ? false : false);


    };
    const toggleMessengerVisibility = () => {
        setIsNotificationVisible(false);
        dispatch(setshowMessangerModal(!showMessangerModal))
        setIsBoxVisible(true ? false : false);
        dispatch(setShowMenu(false))

    };
    const toggleMenuVisibility = () => {
        setIsNotificationVisible(false);
        setIsBoxVisible(true ? false : false);
        dispatch(setshowMessangerModal(true ? false : false))
        dispatch(setShowMenu(!showMenu))
    }
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const inputRef = useRef()
    const user = useSelector((state) => state.user.user);
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
    const handleSearchUser = async (e) => {
        e.preventDefault();
        const searchValue = inputRef.current.value;

        try {
            const users = await dispatch(getAllUsers()).unwrap();
            console.log(users);

            const searchedUsers = users.filter(user =>
                user.displayName && user.displayName.toLowerCase().includes(searchValue.toLowerCase())
            );
            console.log(searchedUsers);

            navigate('/searchedUser', { state: { searchedUsers } });

            inputRef.current.value = '';
        } catch (error) {
            console.error("Error searching user:", error);
        }
    };


    const handleLogout = async () => {
        try {
            await signOut(auth)
            navigate('/login')
            dispatch(clearUser())

        } catch (error) {
            console.log('failed to login')
            return;
        }
    }


    if (!isAuthenticated) {
        return (
            <Login />
        )
    }
    return (

        <div className=' w-full h-16 shadow-md flex justify-between items-center px-5 border-b'>
            <div className=' flex items-center min-w-[20%]'>
                <FaFacebook size={35} className="text-blue-600" />
                <button
                    onClick={() => setOpenSearchModal(true)}
                    type="submit"
                    className="flex tablet:hidden items-center px-2  rounded-full ml-2 bg-gray-100 h-10 w-10 justify-center"
                >
                    <FaSearch className="h-5 w-5 text-gray-500" />
                </button>
                <form onSubmit={handleSearchUser} className='relative  p-4 tablet:flex laptop:flex flex-col hidden'>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            className="p-2 border-[1px] border-gray-400 rounded-full w-full outline-none placeholder:text-sm"
                            placeholder="Search Facebook"
                        />
                        <button
                            type="submit"
                            className="absolute inset-y-0 right-0 flex items-center px-2  rounded-full"
                        >
                            <FaSearch className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                </form>

            </div>



                {
                    openSearchModal &&
                    <div className='absolute top-0 left-0 bg-white w-full  h-[13%] shadow-lg'>
                        <div onClick={() => setOpenSearchModal(false)} className='flex justify-end p-1 '>

                            <FaTimes />
                        </div>
                        <form onSubmit={handleSearchUser} className='relative  p-4 flex flex-col'>
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    className="p-2 border-[1px] border-gray-400 rounded-full w-full outline-none placeholder:text-sm"
                                    placeholder="Search Facebook"
                                />
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 right-0 flex items-center px-2  rounded-full"
                                >
                                    <FaSearch className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                        </form>
                    </div>
                }

            <div className='laptop:flex space-x-4  w-[38%]  justify-start hidden'>
                <Link to='' className='hover:bg-slate-100 rounded-lg px-10 py-3 cursor-pointer list-none'>
                    <FaHome size={28} />
                </Link>
                <Link to='friends' className='hover:bg-slate-100 rounded-lg px-10 py-3 cursor-pointer list-none'>
                    <FaUserFriends size={28} />
                </Link>
                <Link to='videoHome' className='hover:bg-slate-100 rounded-lg px-10 py-3 cursor-pointer list-none'>
                    <FaVideo size={28} />
                </Link>
            </div>

            <div className='flex items-center space-x-1'>

                <li
                    onClick={toggleMenuVisibility}
                    className='hover:bg-slate-200 rounded-full p-3 bg-slate-100 cursor-pointer list-none'>
                    <FaBars size={20} className='cursor-pointer' />
                    {
                        showMenu && <MenuModal />
                    }

                </li>
                <li
                    onClick={toggleMessengerVisibility}
                    className='hover:bg-slate-200 rounded-full p-3 bg-slate-100 cursor-pointer list-none'>
                    <FaFacebookMessenger size={20} className='cursor-pointer' />
                    {
                        showMessangerModal &&
                        <MessengerModal />

                    }
                </li>
                <li onClick={toggleNotificationVisibility} className='hover:bg-slate-200 rounded-full p-3 bg-slate-100 cursor-pointer list-none'>
                    <FaBell

                        size={20} className='cursor-pointer' />
                    {
                        isNotificationVisible && (
                            <NotificationModal />

                        )
                    }



                </li>
                <li className='rounded-full bg-slate-100 cursor-pointer list-none h-10 w-10'>
                    <img
                        onClick={toggleBoxVisibility}
                        src={user.photoURL || placeholderImage}
                        alt="User Profile"
                        className='rounded-full cursor-pointer h-10 w-10'
                    />
                    {isBoxVisible && (
                        <div className="flex min-w-[17%] flex-col absolute top-11 right-2 mt-2 p-2 border bg-white border-gray-300 rounded shadow-lg z-10">
                            <ul>
                                <li className="text-lg font-semibold rounded-xl p-2 flex items-center space-x-1 hover:bg-gray-100">
                                    <FaCog className="text-gray-600" /> {/* Icon for settings */}
                                    <Link to='setting'>
                                        Settings
                                    </Link>
                                </li>
                                <li className="text-lg font-semibold rounded-xl p-2 flex items-center space-x-1 hover:bg-gray-100">
                                    <FaSignOutAlt className="text-gray-600" /> {/* Icon for logout */}
                                    <button onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>

            </div>
        </div>
    );
}

export default Navbar;
