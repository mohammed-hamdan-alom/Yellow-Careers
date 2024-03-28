import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import AxiosInstance from "@/utils/AxiosInstance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BigAlert from "@/components/Alert/BigAlert";

const EmployerRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyId, registerEmail, isAdmin } = location.state || {};

  const [errors, setErrors] = useState("");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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
          try {
            await registerEmployer(
              registerEmail,
              password,
              password2,
              firstName,
              lastName,
              otherNames,
              phoneNumber,
              companyId,
              false
            );
          } catch (error) {
            console.error(error);
            setErrors(error.response.data);
          }
        }
      } else {
        try {
          await registerEmployer(
            registerEmail,
            password,
            password2,
            firstName,
            lastName,
            otherNames,
            phoneNumber,
            companyId,
            true
          );
        } catch (error) {
          console.error(error);
          setErrors(error.response.data);
        }
      }
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-[600px] max-h-screen overflow-y-auto">
        <CardHeader>
          <CardTitle>Employer Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="space-y-2 mb-4">
              <Label>Email</Label>
              <Input type="email" name="email" value={registerEmail} disabled />
            </div>
            <div className="space-y-2 mb-4">
              <Label>Password</Label>
              <Input
                data-testid="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <BigAlert message={errors.password} />}
            </div>
            <div className="space-y-2 mb-4">
              <Label>Confirm Password</Label>
              <Input
                data-testid="confirm-password"
                type="password"
                name="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              {errors.password2 && <BigAlert message={errors.password2} />}
            </div>
            <div className="space-y-2 mb-4">
              <Label>First Name</Label>
              <Input
                data-testid="first-name"
                type="text"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.first_name && <BigAlert message={errors.first_name} />}
            </div>
            <div className="space-y-2 mb-4">
              <Label>Last Name</Label>
              <Input
                data-testid="last-name"
                type="text"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.last_name && <BigAlert message={errors.last_name} />}
            </div>
            <div className="space-y-2 mb-4">
              <Label>Other Names</Label>
              <Input
                data-testid="other-names"
                type="text"
                name="other_names"
                value={otherNames}
                onChange={(e) => setOtherNames(e.target.value)}
              />
              {errors.other_names && <BigAlert message={errors.other_names} />}
            </div>
            <div className="space-y-2 mb-4">
              <Label>Phone Number</Label>
              <Input
                data-testid="phone-number"
                type="text"
                name="phone_number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phone_number && <BigAlert message={errors.phone_number} />}
            </div>
            <br />
            <Button type="submit" data-testid="submit-button">Register</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerRegister;