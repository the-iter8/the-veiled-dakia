import './App.css';
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './Components/Landing';
import Navbar from './Components/Navbar';
import MessageCenter from './Components/MessageCenter';
import Spinner from './Components/Spinner';

const firebaseConfig = {
  apiKey: 'AIzaSyDZMzN-E-k1ye4JCl8mmudhvIkKNMaL9dU',
  authDomain: 'the-veiled-dakia.firebaseapp.com',
  projectId: 'the-veiled-dakia',
  storageBucket: 'the-veiled-dakia.appspot.com',
  messagingSenderId: '508390561374',
  appId: '1:508390561374:web:99781557033bedc09bc6cf',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const Context = React.createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setSpinner(false);
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(false);
      }
    });
  }, []);

  return (
    <Context.Provider
      value={{
        db,
        auth,
        users,
        currentUser,
        setUsers,
        setSpinner,
        setCurrentUser,
      }}
    >
      {spinner ? (
        <Spinner />
      ) : (
        <BrowserRouter>
          <Navbar></Navbar>
          <Routes>
            <Route
              path='/'
              element={currentUser ? <MessageCenter /> : <Landing />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </Context.Provider>
  );
}

export default App;
