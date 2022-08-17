import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../App';
import {
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { RiSendPlaneLine } from 'react-icons/ri';

export default function MessageCenter() {
  const { db, currentUser, users, setUsers } = useContext(Context);
  const [chatRoom, setChatRoom] = useState('');
  const [data, setData] = useState([]);

  const [messageField, setMessageField] = useState('');
  const [chatRoomField, setChatRoomField] = useState('');


  useEffect(() => {
    // remove warning.
    const getData = async () => {
      onSnapshot(collection(db, chatRoom), (querySnapshot) => {
        const currentDoc = querySnapshot.docs;
        const sorted = currentDoc.sort(function (a, b) {
          return a.data().timestamp.seconds - b.data().timestamp.seconds;
        });
        setData(sorted);
      });
    };
    getData();
  }, [db, chatRoom]);

  const joinRoom = async (e) => {
    e.preventDefault();
    setChatRoom(chatRoomField);

    // add the new user to the chat room user list. 
    if (!users.includes(currentUser.photoURL)) {
      setUsers([...users, currentUser.photoURL]);
    }

    try {
      await addDoc(collection(db, chatRoomField), {
        text: `${currentUser.displayName} has entered the chat.`,
        timestamp: serverTimestamp(),
        uid: currentUser.uid,
        photo: currentUser.photoURL,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageField !== '')
      try {
        await addDoc(collection(db, chatRoom), {
          text: messageField,
          timestamp: serverTimestamp(),
          uid: currentUser.uid,
          photo: currentUser.photoURL,
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    setMessageField('');
  };

  const discardRoom = () => {
    data.map(async (msg) => {
      await deleteDoc(doc(db, chatRoom, msg.id));
      return null;
    });
    setChatRoom('');
    setChatRoomField('');
  };

  const ChatBubble = ({ text, messageState, photo }) => {
    // Checks if the mssg is sent or rec. and adjust the avatar and mssg accordingly

    return (
      <div className={`${messageState} chatBubble`}>
        <Badge
          badgeContent={
            <Avatar src={photo} sx={{ width: 25, height: 25 }}></Avatar>
          }
          anchorOrigin={{
            vertical: 'top',
            horizontal: messageState === 'sent' ? 'left' : 'right',
          }}
        >
          <p className='text'>{text}</p>
        </Badge>
      </div>
    );
  };

  return (
    <>
      <div className='container chatContainer'>
        <div className='subContainer'>
          <div className='roomForm paperContainer'>
            <TextField
              focused
              required
              type='text'
              color='secondary'
              label='Enter Room Name'
              value={chatRoomField}
              onChange={(e) => {
                setChatRoomField(e.target.value);
              }}
            />

            <Button
              size='large'
              color='secondary'
              onClick={joinRoom}
              variant='outlined'
            >
              Join/Create
            </Button>

            <Button
              size='large'
              color='secondary'
              onClick={discardRoom}
              variant='outlined'
            >
              Discard Room
            </Button>
          </div>
        </div>

        <div className='messageContainer subContainer'>
          {!chatRoom ? (
            <div className='noChatRoom'>
              <p className='mainHeading'>No Chatroom Selected.</p>
              <p className='subHeading'>
                Enter a chatroom name on in the input field and click on
                Join/Create to initiate a chat room{' '}
              </p>
            </div>
          ) : (
            <div className='chatRoom'>
              <header className='messageHeader chatRoomSubContainers'>
                <div className='userList'>
                  <AvatarGroup max={2}>
                    {/* Check and fetch the images of users  */}
                    {users.map((photo, index) => {
                      return <Avatar src={photo} alt='username' key={index} />;
                    })}
                  </AvatarGroup>
                </div>

                <p className='subHeading' style={{ marginBottom: 0 }}>
                  Chatroom - {chatRoom}
                </p>
              </header>

              <div className='messageList chatRoomSubContainers'>
                <br />

                {data &&
                  data.map((msg) => {
                    const currentMsg = msg.data();
                    const messageState =
                      currentMsg.uid === currentUser.uid ? 'sent' : 'received';
                    return (
                      <ChatBubble
                        key={msg.id}
                        text={currentMsg.text}
                        photo={currentMsg.photo}
                        messageState={messageState}
                      />
                    );
                  })}
                <div id='bottom'></div>
              </div>

              <form
                action=''
                onSubmit={sendMessage}
                className='sendMessage chatRoomSubContainers'
              >
                <TextField
                  focused
                  fullWidth
                  type='text'
                  variant='standard'
                  color='secondary'
                  value={messageField}
                  onChange={(e) => {
                    setMessageField(e.target.value);
                  }}
                  placeholder='Type a message '
                />

                <button color='primary' type='submit'>
                  <RiSendPlaneLine size={25} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <footer>
        <h4>
          {' '}
          Made with 💓 by{' '}
          <a href='https://iter8.netlify.app/' rel='noreferrer' target='_blank'>
            iter8
          </a>
        </h4>
      </footer>
    </>
  );
}
