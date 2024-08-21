import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store, { persistor } from './app/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react';

// import Home from './components/home/Home.jsx'
import Login from './components/authentication/Login.jsx'
import Signup from './components/authentication/Signup.jsx'
import ResetPass from './components/authentication/ResetPass.jsx'
import Navbar from './components/navbar/Navbar.jsx'
import Layout from './components/Layout.jsx'
import Home from './components/home/Home.jsx'
import VideoHome from './components/home/videoHome/VideoHome.jsx'
import UserProfile from './components/userProfile/UserProfile.jsx'
import SearchedUser from './components/searchedUser/SearchedUser.jsx'
import Setting from './components/userSetting/Setting.jsx'
import PersonalDetail from './components/userSetting/PersonalDetail.jsx'
import PassSecurity from './components/userSetting/PassSecurity.jsx'
import UserDisplay from './components/userDisplay/UserDisplay.jsx'
import FriendRequestNotifications from './components/notification/FriendRequestNotifications.jsx'
import FrindsPage from './components/friend/FrindsPage.jsx'
import UplaodVideo from './components/home/videoHome/UplaodVideo.jsx'
import VideoDisplay from './components/home/videoHome/VideoDisplay.jsx'
import InPhoneFriendPreview from './components/friend/InPhoneFriendPreview.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'searchedUser',
        element: <SearchedUser />
      },
      {
        path: 'notification',
        element: <FriendRequestNotifications />
      },
      {
        path: 'videoHome',
        element: <VideoHome />,
        children: [
          {
            path: '',
            element: <VideoDisplay />,
          },
          {
            path: 'uploadVideo',
            element: <UplaodVideo />,
          },
        ],
      },
      {
        path: 'friends',
        element: <FrindsPage />,
       
      },
      {
        path: 'phoneFriendPreview',
        element: <InPhoneFriendPreview />
      },
      {
        path: 'userProfile',
        element: <UserProfile />
      },
      {
        path: 'userDisplay',
        element: <UserDisplay />
      },
      // {
      //   path:'/',
      //   element:<Navbar />
      // },


      // {path:'/resetPass',
      //   element:<ResetPass />
      // },
    ]

  },
  {
    path: '/setting',
    element: <Setting />,
    children: [
      {
        path: 'personalDetail',
        element: <PersonalDetail />
      },
      {
        path: 'passwordAndSecurity',
        element: <PassSecurity />
      }
    ]
  },
  {
    path: '/signUp',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/setting',
    element: <Setting />
  },




])




createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <RouterProvider router={router}>
      <PersistGate loading={null} persistor={persistor}>

        <App />
      </PersistGate>

    </RouterProvider>
  </Provider>,
)
