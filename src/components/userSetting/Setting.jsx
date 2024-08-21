import React, { useState } from 'react'
import SideBar from './SideBar'
import { Link, Outlet } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'

function Setting() {


    return (
        <div className='flex bg-[#142747] text-white'>
            <Link to='/'>
            <FaTimes size={23} className='fixed right-8 top-4 cursor-pointer hover:scale-110' />
            </Link>
            <SideBar />
            <Outlet />
        </div>
    )
}

export default Setting
