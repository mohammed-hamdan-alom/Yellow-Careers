import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AxiosInstance from "@/utils/AxiosInstance";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BigAlert from "@/components/Alert/BigAlert";

const InvitedEmployerVerification = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.get(
        `api/invited-employer/get/?email=${email}`
      );
      if (response.data.email === email && response.data.code === code) {
        navigate(`/auth/register-employer`, {
          state: {
            companyId: response.data.company,
            registerEmail: email,
            isAdmin: false,
          },
        });
      } else {
        alert("Invalid email or code");
      }
    } catch (error) {
      console.error("Error verifying email and code:", error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Verify Invited Employer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4 space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 space-y-2">
              <Label>Code</Label>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            {errors && <BigAlert message={errors.error} type="error" />}
            <Button className="mt-4" type="submit">
              Verify
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitedEmployerVerification;
