import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:9000/register', {
        username,
        email,
        password,
      });
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className='container d-flex flex-column align-items-center'>
      <h2 className='fs-2 fw-bold text-info mt-5 mb-4'>Register</h2>
      <form className='w-75'>
        <div className='mb-3'>
          <input className='form-control p-2' type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='mb-3'>
          <input className='form-control p-2' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='mb-3'>
          <input className='form-control p-2' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className='mb-3 d-grid'>
          <button className='btn btn-primary btn-lg' onClick={handleRegister}>Register</button>
        </div>
      </form>
      <p>Login if you're already registered</p>
      <Link to="/">
        <button className='btn btn-outline-primary btn-lg'>Login</button>
      </Link>
    </div>
  );
}

export default Registration;
