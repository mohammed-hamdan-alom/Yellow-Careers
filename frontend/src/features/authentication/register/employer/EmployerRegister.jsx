import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import AxiosInstance from "@/utils/AxiosInstance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployerRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyId, registerEmail, isAdmin } = location.state || {};

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerEmployer } = useContext(AuthContext);

  useEffect(() => {
    if (!companyId || !registerEmail) {
      navigate("/");
    }
  }, [companyId, registerEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        if (!isAdmin) {
          const response = await AxiosInstance.delete(
            `api/invited-employer/delete/?email=${registerEmail}`
          );
          if (response.status === 200) {
            registerEmployer(registerEmail, password, password2, companyId, false);
          }
        } else {
          console.log()
          registerEmployer(registerEmail, password, password2, companyId, true);
        }
      } catch (error) {
        console.error("Error registering employer:", error);
      }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Employer Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <Label className="mb-2">Email</Label>
            <Input
              className="mb-4"
              type="email"
              name="email"
              value={registerEmail}
              disabled
            />
            <Label className="mb-2">Password</Label>
            <Input
              className="mb-4"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Label className="mb-2">Confirm Password</Label>
            <Input
              className="mb-4"
              type="password"
              name="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <br />
            <Button type="submit">Register</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerRegister;
