import React, { useContext, useEffect, useState } from 'react';
import {
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { Context } from '../App';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function MessageCenter() {
  const { db, currentUser } = useContext(Context);
  const [chatRoom, setChatRoom] = useState('');
  const [data, setData] = useState([]);

  const [messageField, setMessageField] = useState('');
  const [chatRoomField, setChatRoomField] = useState('');

  useEffect(() => {
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
  }, [chatRoom]);

  const joinDyad = async (e) => {
    e.preventDefault();
    setChatRoom(chatRoomField);

    try {
      const docRef = await addDoc(collection(db, chatRoomField), {
        text: `${currentUser.displayName} has entered the chat.`,
        timestamp: serverTimestamp(),
        uid: currentUser.uid,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, chatRoom), {
        text: messageField,
        timestamp: serverTimestamp(),
        uid: currentUser.uid,
        // Photourl option.
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setMessageField('');
  };

  const discardDyad = () => {
    data.map(async (msg) => {
      await deleteDoc(doc(db, chatRoom, msg.id));
      return null;
    });
    setChatRoom('');
    setChatRoomField('');
  };

  return (
    <>
      {currentUser && (
        <div className='container'>
          <div className='formDyad'>
            <TextField
              required
              label='Enter Dyad Name'
              type='text'
              value={chatRoomField}
              onChange={(e) => {
                setChatRoomField(e.target.value);
              }}
            />

            <Button size='large' onClick={joinDyad} variant='outlined'>
              Join/Create
            </Button>

            <Button size='large' onClick={discardDyad} variant='outlined'>
              Discard Dyad
            </Button>
          </div>

          <div>
            {data &&
              data.map((msg) => {
                const currentMsg = msg.data();
                // timestamp
                // Check if the UID === current UID
                return <p key={msg.id}>{currentMsg.text}</p>;
              })}

            <form action='' onSubmit={sendMessage}>
              <input
                type='text'
                value={messageField}
                onChange={(e) => {
                  setMessageField(e.target.value);
                }}
              />
              <button type='submit'>send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
