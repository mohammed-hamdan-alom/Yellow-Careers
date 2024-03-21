import  { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import AxiosInstance from '@/utils/AxiosInstance';

const EmployerRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyId, registerEmail } = location.state || {};

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerEmployer } = useContext(AuthContext);

  useEffect(() => {
    if (!companyId || !registerEmail) {
      navigate('/');
    }
  }, [companyId, registerEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AxiosInstance.delete(`api/invited-employer/delete/?email=${registerEmail}`);
      if (response.status === 200) {
      registerEmployer(registerEmail, password, password2, companyId);
      }
    } catch (error) {
      console.error('Error registering employer:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Employer Register</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={registerEmail}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <Button type='submit'>register</Button>
          <Link to="/auth/login">Have an account? Click here to log in</Link>
        </div>
      </form>
    </div>
  );
};

export default EmployerRegister;

