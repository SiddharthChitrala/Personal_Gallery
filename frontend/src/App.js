import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import Login from './login';
import Registration from './Registration';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId('');
  };

  return (
    <Router>
      <div className="App">
        <div className='container-fluid'>
          <p className='fs-3 fw-bolder '>Image Upload App</p>
        </div>
        <Routes>
          <Route
            path="/"
            element={loggedIn ? <ImageUpload userId={userId} onLogout={handleLogout} /> : <Login setLoggedIn={setLoggedIn} setUserId={setUserId} />}
          />
          <Route path="/register" element={<Registration />} />
          <Route path='/imageupload' element={<ImageUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
