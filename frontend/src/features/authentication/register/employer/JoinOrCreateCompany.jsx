import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const JoinOrCreateCompany = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState();

  const handleSubmit = () => {
    if (selectedOption === "join-company") {
      navigate("/auth/verify-invited-employer"); // Ahmads route
    } else if (selectedOption === "create-company") {
      navigate("/auth/create-company");
    }
  };

  const handleOptionChange = (e) => {
    if (e.target.value) {
      setSelectedOption(e.target.value);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Join or Create a Company</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup className="w-full flex flex-col justify-center">
            <div className="flex flex-row items-center space-x-2">
              <RadioGroupItem value="join-company" id="join-company" onClick={handleOptionChange} />
              <Label htmlFor="join-company">Join a Company</Label>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <RadioGroupItem
                value="create-company"
                id="create-company"
                onClick={handleOptionChange}
              />
              <Label htmlFor="create-company">Create a Company</Label>
            </div>
          </RadioGroup>
          <Button className="w-full mt-5" onClick={handleSubmit}>
            Go
            <div className="ml-1">
              <ArrowRightIcon />
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinOrCreateCompany;
