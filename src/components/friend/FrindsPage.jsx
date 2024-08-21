import React, { useState } from 'react'
import FrindsList from './FrindsList'
import FriendPreview from './FriendPreview'

export default function FrindsPage() {


    const [preview, setPreview] = useState(false)
    const [user, setUser] = useState([])
    return (
        <div className='flex w-full h-[89.5vh] '>
            <FrindsList setUser={setUser} friend={user} setPreview={setPreview} />
            {
            preview ? <FriendPreview friend={user} />:
                <div className='items-center justify-center w-[80%] hidden tablet:flex'>

                    <h1 className='text-2xl'>Select friend to preview</h1>
                </div>
            }

        </div>
    )
}
