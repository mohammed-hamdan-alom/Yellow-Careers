import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import AuthContext from '../../../../context/AuthContext';
import { nationalityOptions } from '@/shared/Nationalities/nationalityOptions';

const JobSeekerRegister = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [otherNames, setOtherNames] = useState("")
  const [dob, setDob] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [nationality, setNationality] = useState("")
  const [sex, setSex] = useState("")

  const { registerJobSeeker } = useContext(AuthContext)

  const handleSubmit = async e => {
    e.preventDefault()
    registerJobSeeker(email, password, password2, firstName, lastName, otherNames, dob, phoneNumber, nationality, sex)
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
        <div className="form-group">
          <label htmlFor='first_name'>First Name</label>
          <input
            name='first_name'
            type='text'
            id='firstName'
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='last_name'>Last Name</label>
          <input
            name='last_name'
            type='text'
            id='lastName'
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='other_names'>Other Names</label>
          <input
            name='other_names'
            type='text'
            id='otherNames'
            onChange={e => setOtherNames(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor='dob'>Date of Birth</label>
          <input
            name='dob'
            type='date'
            id='dob'
            onChange={e => setDob(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor='phone_number'>Phone Number</label>
          <input
            name='phone_number'
            type='tel'
            id='phoneNumber'
            onChange={e => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='nationality'>Nationality</label>
          <select
            name="nationality"
            id="nationality"
            onChange={e => setNationality(e.target.value)}
            value={nationality}
            required
          >
            <option value="" disabled>
              Select Nationality
            </option>
            {nationalityOptions
              .map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor='sex'>Sex</label>
          <input
            name='sex'
            type='text'
            id='sex'
            onChange={e => setSex(e.target.value)}
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

export default JobSeekerRegister
