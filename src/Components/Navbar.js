import React, { useContext, useState } from 'react';
import { Context } from '../App';
import { signOut } from 'firebase/auth';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import { BsMailbox } from 'react-icons/bs';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Navbar() {
  const { auth, currentUser, setCurrentUser } = useContext(Context);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clickSignOut = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(false);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  function AlertDialog({ open }) {
    return (
      <div>
        <Dialog color='secondary' open={open} onClose={handleClose}>
          <DialogTitle className='dialog mainHeading' sx={{ pt: 3 }}>
            {'How does it actually works?'}
          </DialogTitle>
          <DialogContent className='dialog subHeading' sx={{ px: 5 }}>
            <DialogContentText>
              While the chatroom is active, all the chats are temporarily stores
              in a secure, encrypted database. Once the discard button is
              clicked, everything related to that chatroom is entirely removed
              from the database. Also, The chatroom updates realtime, So
              literally anyone around the world can join it.
            </DialogContentText>
          </DialogContent>
          <DialogActions className='dialog' sx={{ px: 5, pb: 3 }}>
            <Button onClick={handleClose} variant='outlined' color='secondary'>
              Sounds Good
            </Button>
            <Button onClick={handleClose} variant='outlined' color='secondary'>
              I dont actually care
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <AppBar position='static'>
      <AlertDialog open={open} />
      <Toolbar>
        <div className='toolBar'>
          <div className='toolBarChild'>
            <h2>The Veiled Dakia</h2>
            <BsMailbox size={25} />
          </div>
          <div className='toolBarChild'>
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleClickOpen}
            >
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
