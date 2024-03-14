import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AxiosInstance from '@/utils/AxiosInstance';

const InvitedEmployerVerification = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.get(`api/invited-employer/5/update/`);
      if (response.data.email === email && response.data.code === code) {
        navigate(`/auth/register-employer`);
      } else {
        alert("Invalid email or code");
      }
    } catch (error) {
      console.error('Error verifying email and code:', error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Email and Code Verification</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="code">Code</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <Button type='submit'>Verify</Button>
      </form>
    </div>
  );
};

export default InvitedEmployerVerification;
