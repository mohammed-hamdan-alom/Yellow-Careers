import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@radix-ui/react-icons'





const GetStarted = () => {
  
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState();


  const handleSubmit = () => {
    if (selectedOption === 'job-seeker') {
      navigate('/auth/register-jobseeker');
    } else if (selectedOption === 'employer') {
      navigate('/auth/register-employer');
    }
  }

  const handleOptionChange = (e) => {
    if (e.target.value) {
      setSelectedOption(e.target.value);
    }
  }

  return (
    <div className='h-screen flex items-center justify-center'>
      <Card className='max-w-4xl'>
        <CardHeader className='items-center'>
          <CardTitle className='centered-text'>Get started as a Job seeker or as an Employer</CardTitle>
          <CardDescription>Choose your option</CardDescription>
        </CardHeader>

        <CardContent>
          <RadioGroup>
            <div className="flex space-x-4 justify-center">
              <div className="flex flex-row items-center space-x-2">
                <RadioGroupItem data-testid='jobseeker' value="job-seeker" id="job-seeker" onClick={handleOptionChange}/>
                <Label htmlFor="job-seeker">Job Seeker</Label>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <RadioGroupItem data-testid='employer' value="employer" id="employer" onClick={handleOptionChange}/>
                <Label htmlFor="employer">Employer</Label>
              </div>
            </div>
          </RadioGroup>
          <Button className='w-full mt-5' onClick={handleSubmit}>Go<div className='ml-1'><ArrowRightIcon/></div></Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default GetStarted
