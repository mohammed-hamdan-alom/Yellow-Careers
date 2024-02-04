import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/login/LoginPage'
import HomePage from './pages/HomePage'
import Register from './components/register/Register';
import { AuthProvider } from './context/AuthContext';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import PrivateRoute from './utils/PrivateRoute';


function App() {
  return (    
    <Router>
      <AuthProvider>
        <Switch>
          {/* <PrivateRoute component={Dashboard} path='/dashboard' exact/> */}
          <Route component={HomePage} path='/' exact/>
          <Route component={LoginPage} path='/login' />
          <Route component={Register} path='/register' />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
