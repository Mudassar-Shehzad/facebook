import React from 'react'
import { Link } from 'react-router-dom'

function MenuModal() {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="space-y-2 flex flex-col max-h-[80vh] overflow-y-scroll absolute top-12 right-40 mt-2 p-2 border bg-gray-100 border-gray-300 rounded shadow-lg z-10"
    >

      <div className="flex items-center space-x-2  p-1 rounded-lg w-full flex-col">
        <h1 className='text-xl font-bold w-full'>Menu</h1>
        <ul className='flex flex-col w-full mt-4 bg-white p-2 rounded-lg'>
          <Link to='' className='hover:bg-gray-100 w-full p-2 rounded-lg font-bold'>
          Home
          </Link>
          <Link to='/friends' className='hover:bg-gray-100 w-full p-2 rounded-lg font-bold'>
          Friends
          </Link>
          <Link to='/videoHome' className='hover:bg-gray-100 w-full p-2 rounded-lg font-bold'>
          Videos
          </Link>
          {/* <Link className='hover:bg-gray-100 w-full p-2 rounded-lg font-bold'>
          Videos
          </Link> */}
          <Link to='/userProfile' className='hover:bg-gray-100 w-full p-2 rounded-lg font-bold'>
          Your Profile
          </Link>

        </ul>

      </div>



      {/* <div>

            <div className=' p-2 flex space-x-2'>
                <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
            </div>
            <div className=' p-2 flex space-x-2'>
                <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
            </div>
            <div className=' p-2 flex space-x-2'>
                <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
            </div>
            <div className=' p-2 flex space-x-2'>
                <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
            </div>
            <div className=' p-2 flex space-x-2'>
                <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
            </div>
            <div className=' p-2 flex space-x-2'>
                <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
            </div>
            <div className=' p-2 flex space-x-2'>
                <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
            </div>
            <div className=' p-2 flex space-x-2'>
                <div className='h-[6.5vh] w-[18%] rounded-full bg-gray-100'></div>
                <div className='h-[6.5vh] w-[85%] rounded-full bg-gray-100'></div>
            </div>
        </div> */}
    </div>)
}

export default MenuModal
