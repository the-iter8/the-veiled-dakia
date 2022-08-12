import React, { useContext } from 'react';
import { Context } from '../App';
import { signOut } from 'firebase/auth';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function Navbar() {
  const { auth, currentUser } = useContext(Context);
  const clickSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log(currentUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <AppBar position='static'>
      <Toolbar sx={{ background: 'white' }}>
        <div className='toolBar'>
          <div className='toolBarChild'>
            <Avatar alt='Travis Howard' />
            <Typography color="primary" variant='h5'>The Veiled Dakia</Typography>
          </div>
          <div className='toolBarChild'>
            <Button variant='outlined'>How it works?</Button>
            {currentUser && (
              <Button variant='outlined' onClick={clickSignOut}>
                Sign Out
              </Button>
            )}
            <Avatar alt='Travis Howard' src={currentUser.photoURL} />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}
