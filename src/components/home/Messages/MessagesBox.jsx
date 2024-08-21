import React, { useEffect, useState, useRef } from 'react';
import { FaMinus, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, setShowChatBox } from '../../../features/user/UserSlice';
import { getFirestore, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const db = getFirestore();

function MessagesBox({ senderUid, recieverUid, reciever, recieverDisplayName, recieverPhotoURL }) {
    const currentUser = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [recieverPhotourl, setRecieverPhotourl] = useState('');
    const [recieverDName, setRecieverDName] = useState('');
    const [recieverId, setRecieverId] = useState(recieverUid || '');
    const placeholderImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';

    const messagesEndRef = useRef(null);

    useEffect(() => {
        console.log(senderUid, reciever, recieverUid);
        if (reciever && reciever.length > 0) {
            const user = reciever[0];
            console.log(user)
            // setRecieverDisplayName(user.displayName);
            // setRecieverPhotoURL(user.photoURL);
            setRecieverId(user.uid);
        }
    }, [reciever, recieverUid]);

    useEffect(() => { 
        const q = query(
            collection(db, 'messages'),
            where('senderId', 'in', [currentUser.uid, recieverId]),
            where('recieverId', 'in', [currentUser.uid, recieverId]),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
        }, (error) => {
            console.error("Error fetching messages: ", error.message);
            if (error.code === "permission-denied") {
                alert("You don't have permission to access messages.");
            }
        });

        return () => unsubscribe();
    }, [currentUser.uid, recieverId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text) return;
        if (!recieverId) {
            alert("Receiver ID is missing!");
            return;
        }
        try {
            setRecieverDName(recieverDisplayName),
            setRecieverPhotourl(recieverPhotoURL)
            dispatch(sendMessage({ senderId: senderUid, recieverId, messageText: text , recieverDisplayName:recieverDisplayName, recieverPhotoURL:recieverPhotoURL}));
            setText('');
        } catch (error) {
            console.log('Could not send message', error);
        }
    };

    const handleShowChatBox = () => {
        console.log('Dispatching setShowChatBox with false');
        dispatch(setShowChatBox(false));
    };

    return (
        <div className='absolute bottom-0 right-0 tablet:right-5 h-[74vh] w-[100%] phone:w-[70%] tablet:w-[50%] laptop:w-[30%] desktop:w-[25%] desktop:right-24 border-2 bg-white rounded-t-lg'>
            <div className='flex justify-between shadow-md w-full p-2 h-[10vh] items-center'>
                <div className='flex items-center'>
                    <img src={recieverPhotoURL || placeholderImage} alt='Profile' className='h-12 w-12 rounded-full p-1' />
                    <h1 className='text-lg ml-2'>{recieverDisplayName || 'Username'}</h1>
                </div>
                <div className='flex'>
                    {/* <button className='hover:bg-gray-100 p-2 rounded-full'>
                        <FaMinus size={18} />
                    </button> */}
                    <button onClick={handleShowChatBox} className='hover:bg-gray-100 p-2 rounded-full'>
                        <FaTimes size={20} />
                    </button>
                </div>
            </div>
            <div className='h-[57vh] w-full p-2 space-y-2 overflow-y-scroll'>
                {messages.map((mes) => (
                    <div key={mes.id} className={`flex ${mes.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}>
                        {mes.senderId !== currentUser.uid && (
                            <img src={reciever.photoURL || placeholderImage} alt='profile' className='h-10 w-10 rounded-full' />
                        )}
                        <p className={`pb-1 px-3 py-2 rounded-md max-w-[60%] text-left ${mes.senderId === currentUser.uid ? 'bg-blue-500 text-white mr-1' : 'bg-gray-100 ml-1'}`}>
                            {mes.messageText}
                        </p>
                        {mes.senderId === currentUser.uid && (
                            <img src={currentUser.photoURL || placeholderImage} alt='profile' className='h-10 w-10 rounded-full' />
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* This div is used to scroll to the bottom */}
            </div>
            <div className='flex justify-center'>
                <form onSubmit={handleSendMessage} className='flex items-center justify-between w-full h-[7vh] px-2'>
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        type='text'
                        placeholder='Aa'
                        className='p-3 bg-gray-200 h-full w-full rounded-md outline-none text-gray-700'
                    />
                    <button type='submit' className='ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MessagesBox;
