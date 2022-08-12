import React, { useContext, useEffect } from 'react';
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from 'firebase/auth';
import { Context } from '../App';
import Paper from '@mui/material/Paper';

export default function Landing() {
  const { auth, currentUser } = useContext(Context);
  const provider = new GoogleAuthProvider();

  const signInHandle = () => {
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }, []);

  return (
    <>
      <Paper sx={{ height: '90vh' }}>
        {/* <button onClick={signInHandle}>Login With Google</button>
            <h1>{currentUser.email}</h1> */}
        <img
          src='./post.png'
          alt='lorem20'
          srcset=''
          style={{ width: '30%' }}
        />
      </Paper>
    </>
  );
}
