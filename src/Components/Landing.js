import React, { useContext } from 'react';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { Context } from '../App';
import Button from '@mui/material/Button';

export default function Landing() {
  const { auth } = useContext(Context);
  const provider = new GoogleAuthProvider();

  const signInHandle = async () => {
    await signInWithRedirect(auth, provider);
  };

  return (
    <>
      <div className='container'>
        <div className='paperContainer'>
          <p className='mainHeading'>
            Chat with anyone, anywhere without leaving a trace.
          </p>
          <p className='subHeading'>
            tête-à-tête about anything and discard the chat room to completely
            remove the converstaion.
          </p>
          <Button
            size='large'
            color='secondary'
            variant='outlined'
            onClick={signInHandle}
          >
            Login With Google
          </Button>
        </div>
      </div>
      
    </>
  );
}
