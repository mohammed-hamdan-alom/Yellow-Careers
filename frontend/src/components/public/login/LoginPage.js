import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {

  const {loginUser} = useContext(AuthContext)
  const handleSubmit = e => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    email.length > 0 && loginUser(email, password)
  }



  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            name='email'
            type="email"
            id="email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            name='password'
            type="password"
            id="password"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="button primary">Log In</button>
          <Link to="/register">
            New here? Click here to create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;