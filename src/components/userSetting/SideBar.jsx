import React from 'react'
import { Link } from 'react-router-dom'
import { FaIdCard, FaLock } from 'react-icons/fa';
import '../../app.css'
function SideBar() {
    return (
        <div className='w-[20%] h-screen shadow-lg px-3 py-10 border-r-[1px] border-gray-700'>
            <ul className=''>
                <li className='glass-effect  text-lg font-semibold  rounded-xl p-2 flex items-center space-x-1'>
                    <FaIdCard className='' />
                    <Link to='personalDetail' >
                        Personal Detail
                    </Link>
                </li>
                <li className='glass-effect text-lg font-semibold rounded-xl p-2 flex items-center space-x-1'>
                    <FaLock className='' />
                    <Link to='passwordAndSecurity'>
                        Password and Security
                    </Link>
                </li>
            </ul>


        </div>
    )
}

export default SideBar
