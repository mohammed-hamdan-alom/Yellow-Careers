import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const {registerUser} = useContext(AuthContext)

  const handleSubmit = async e => {
    e.preventDefault()
    registerUser(email, password, password2)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="email">email</label>
          <input
            name='email'
            type="email"
            id="email"
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            name='password'
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            name='password2'
            type='password'
            id='password2'
            onChange={e => setPassword2(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="button primary">Register</button>
          <button type="button" className="button secondary">Cancel</button>
          <Link to='/login'>Have an account? Click here to log in</Link>
        </div>
      </form>
    </div>
  )
}

export default Register;
