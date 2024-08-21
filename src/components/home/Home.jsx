import React, { useEffect, useState } from 'react'
import HomeSideBar from './HomeSideBar'
import HomeRight from './HomeRight'
import HomeMiddle from './HomeMiddle'
import { useDispatch, useSelector } from 'react-redux'
import Login from '../authentication/Login'
import MessagesBox from './Messages/MessagesBox'
import { useLocation } from 'react-router-dom'
import { setShowChatBox } from '../../features/user/UserSlice'
function Home() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  // console.log("Current user state:", isAuthenticated); 
  const showChatBox = useSelector((state) => state.user.ShowChatBox)
  const dispatch =  useDispatch()
  const location = useLocation()
  const { recieverUid, reciever,  recieverPhotoURL, recieverDisplayName  } = location.state || {};
  // const [showChat, setShowChat] = useState(showChatBox)
  const currentUser = useSelector((state) => state.user.user)


// const dispatch = useDispatch()
  useEffect(() => {
   dispatch (setShowChatBox(showChatBox));
    // console.log(recieverUid, reciever)
  }, [showChatBox]);

 
  if (isAuthenticated) {
    return (
      <div className='flex justify-between overflow-y-scroll bg-gray-100 tablet:h-[95vh] laptop:h-[90vh]'>
        <HomeSideBar />
        <HomeMiddle />
        <HomeRight />
        {
          showChatBox &&
           <MessagesBox senderUid={currentUser.uid} recieverUid={recieverUid} reciever={reciever} recieverPhotoURL={recieverPhotoURL} recieverDisplayName={recieverDisplayName} />

        }
            {/* <button 
          // onClick={handleToggleChatBox} 
          onClick={() => dispatch(setShowChatBox(false))}
          className='fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full'
        >
          {showChat ? 'Hide Chat' : 'Show Chat'}
        </button> */}
      </div>
    )
  }
  return (
    <Login />

  )
}

export default Home
