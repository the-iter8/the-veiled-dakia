import React, { useContext } from 'react';
import { Context } from '../App';
import { signOut } from 'firebase/auth';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import { BsMailbox } from 'react-icons/bs';

export default function Navbar() {
  const { auth, users, setUsers, currentUser, setCurrentUser } =
    useContext(Context);
  const clickSignOut = () => {
    signOut(auth)
      .then(() => {
        setUsers(users.filter((item) => item !== currentUser.photoURL));
        setCurrentUser(false);
      })

      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <AppBar position='static'>
      <Toolbar>
        <div className='toolBar'>
          <div className='toolBarChild'>
            <h2>The Veiled Dakia</h2>
            <BsMailbox size={25} />
          </div>
          <div className='toolBarChild'>
            <Button variant='outlined' color='secondary'>
              How it works?
            </Button>
            {currentUser && (
              <Button
                variant='outlined'
                color='secondary'
                onClick={clickSignOut}
              >
                Sign Out
              </Button>
            )}
            <Avatar alt='N' src={currentUser.photoURL} />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}
