import React, { useContext } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { jwtDecode } from 'jwt-decode'
import AuthContext from '../context/AuthContext'

const HomePage = () => {

  const {user, logoutUser} = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")

  if (token) {
    const decoded = jwtDecode(token)
    var email = decoded.email
  }

  return (
    <div>
      <h1>
        Hello pookie
      </h1>
      {token === null &&
      <>
        <div>
          <Link to='/login'>Login</Link>
        </div>
        <div>
          <Link to='/register'>Register</Link>
        </div>
      </>
      }
      {token !== null &&
        <div>
          <a onClick={logoutUser} style={{cursor: 'pointer'}}>Logout</a>
        </div>
      }
    </div>
  )
}

export default HomePage
