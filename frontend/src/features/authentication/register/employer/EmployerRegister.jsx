import  { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../../../context/AuthContext';
import { Button } from '@/components/ui/button';

const EmployerRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [company, setCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const { registerEmployer } = useContext(AuthContext);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/companies/');
        const data = await response.json();
        setCompanyList(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerEmployer(email, password, password2, company);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <select
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Company
            </option>
            {companyList.map((company) => (
              <option key={company.id} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <Button type='submit'>register</Button>
          <Link to="/login">Have an account? Click here to log in</Link>
        </div>
      </form>
    </div>
  );
};

export default EmployerRegister;

