import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = ({ role, ...props }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If the user is not logged in, redirect to the login page
    
    return <Navigate to="/auth/login" />;
  } else if (role && user.user_type !== role[0]) {
    console.log(role);
    console.log(user.user_type);
    // If the user doesn't have the required role, redirect to a 403 page
    return <Navigate to="/403" />;
  } else {
    // If the user is logged in and has the required role, render the route
    return <Outlet />;
  }
};
export default PrivateRoute;