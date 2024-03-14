import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EmailCodeVerification = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assuming you have an API endpoint for email and code validation
    try {
      const response = await fetch('http://localhost:8000/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      if (data.valid) {
        // If email and code are valid, navigate to EmployerRegister with email and company pre-filled
        navigate(`/register-employer`);
      } else {
        // Handle invalid email or code
        alert("Invalid email or code");
      }
    } catch (error) {
      console.error('Error verifying email and code:', error);
    }
  };

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

export default EmailCodeVerification;
