import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import supabase from './supabase';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import PostDetails from './components/PostDetails';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user'));

  // Callback function to receive user data from Login component
  const handleLogin = (userData) => {
    setUser(userData.user.id);
    console.log("User logged in:", userData, "", userData.user.id, user);
    localStorage.setItem('user', userData.user.id);
  };

  // Function to navigate to create-post
  // const navigateToCreatePost = () => {
  //   window.location.href = `/create-post/${user}`;
  // };

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:postId" element={<PostDetails />} />
          <Route path="/create-post/:userId" element={<CreatePost userId={user} />} />
          <Route path="/" element={<Home user={user} navigateToCreatePost={() => window.location.href = `/create-post/${user}`} />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
