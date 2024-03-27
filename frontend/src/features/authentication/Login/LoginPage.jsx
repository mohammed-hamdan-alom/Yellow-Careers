import React, { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BigAlert from "@/components/Alert/BigAlert";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(user);
    } catch (error) {
      setError("Username or password does not exist");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-[450px]">
        <CardHeader className="justify-center items-center mt-4">
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="mt-4 mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            {error && (
              <BigAlert
                message={"Username or password does not exist"}
              />
            )}
            <div className="mt-4">
              <Button
                type="submit"
                className="w-full"
                data-testid="login-button"
              >
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;