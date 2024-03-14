import React, { useState, useContext }from 'react'
import { Link } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from 'antd';
import { Button } from '@/components/ui/button';

const JobSeekerRegister = () => {
  
  const [user, setUser] = useState({
    email: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: '',
    otherNames: '',
    dob: '',
    phoneNumber: '',
    nationality: '',
    sex: '',
  });

  const nationalityOptions = [
    'Afghan',
    'Albanian',
    'Algerian',
    'American',
    'Andorran',
    'Angolan',
    'Antiguans',
    'Argentinean',
    'Armenian',
    'Australian',
    'Austrian',
    'Azerbaijani',
    'Bahamian',
    'Bahraini',
    'Bangladeshi',
    'Barbadian',
    'Barbudans',
    'Batswana',
    'Belarusian',
    'Belgian',
    'Belizean',
    'Beninese',
    'Bhutanese',
    'Bolivian',
    'Bosnian',
    'Brazilian',
    'British',
    'Bruneian',
    'Bulgarian',
    'Burkinabe',
    'Burmese',
    'Burundian',
    'Cambodian',
    'Cameroonian',
    'Canadian',
    'Cape Verdean',
    'Central African',
    'Chadian',
    'Chilean',
    'Chinese',
    'Colombian',
    'Comoran',
    'Congolese',
    'Costa Rican',
    'Croatian',
    'Cuban',
    'Cypriot',
    'Czech',
    'Danish',
    'Djibouti',
    'Dominican',
    'Dutch',
    'East Timorese',
    'Ecuadorean',
    'Egyptian',
    'Emirian',
    'Equatorial Guinean',
    'Eritrean',
    'Estonian',
    'Ethiopian',
    'Fijian',
    'Filipino',
    'Finnish',
    'French',
    'Gabonese',
    'Gambian',
    'Georgian',
    'German',
    'Ghanaian',
    'Greek',
    'Grenadian',
    'Guatemalan',
    'Guinea-Bissauan',
    'Guinean',
    'Guyanese',
    'Haitian',
    'Herzegovinian',
    'Honduran',
    'Hungarian',
    'Icelander',
    'Indian',
    'Indonesian',
    'Iranian',
    'Iraqi',
    'Irish',
    'Italian',
    'Ivorian',
    'Jamaican',
    'Japanese',
    'Jordanian',
    'Kazakhstani',
    'Kenyan',
    'Kittian and Nevisian',
    'Kuwaiti',
    'Kyrgyz',
    'Laotian',
    'Latvian',
    'Lebanese',
    'Liberian',
    'Libyan',
    'Liechtensteiner',
    'Lithuanian',
    'Luxembourger',
    'Macedonian',
    'Malagasy',
    'Malawian',
    'Malaysian',
    'Maldivan',
    'Malian',
    'Maltese',
    'Marshallese',
    'Mauritanian',
    'Mauritian',
    'Mexican',
    'Micronesian',
    'Moldovan',
    'Monacan',
    'Mongolian',
    'Moroccan',
    'Mosotho',
    'Motswana',
    'Mozambican',
    'Namibian',
    'Nauruan',
    'Nepalese',
    'New Zealander',
    'Ni-Vanuatu',
    'Nicaraguan',
    'Nigerien',
    'North Korean',
    'Northern Irish',
    'Norwegian',
    'Omani',
    'Pakistani',
    'Palauan',
    'Palestinian',
    'Panamanian',
    'Papua New Guinean',
    'Paraguayan',
    'Peruvian',
    'Polish',
    'Portuguese',
    'Qatari',
    'Romanian',
    'Russian',
    'Rwandan',
    'Saint Lucian',
    'Salvadoran',
    'Samoan',
    'San Marinese',
    'Sao Tomean',
    'Saudi',
    'Scottish',
    'Senegalese',
    'Serbian',
    'Seychellois',
    'Sierra Leonean',
    'Singaporean',
    'Slovakian',
    'Slovenian',
    'Solomon Islander',
    'Somali',
    'South African',
    'South Korean',
    'Spanish',
    'Sri Lankan',
    'Sudanese',
    'Surinamer',
    'Swazi',
    'Swedish',
    'Swiss',
    'Syrian',
    'Taiwanese',
    'Tajik',
    'Tanzanian',
    'Thai',
    'Togolese',
    'Tongan',
    'Trinidadian or Tobagonian',
    'Tunisian',
    'Turkish',
    'Tuvaluan',
    'Ugandan',
    'Ukrainian',
    'Uruguayan',
    'Uzbekistani',
    'Venezuelan',
    'Vietnamese',
    'Welsh',
    'Yemenite',
    'Zambian',
    'Zimbabwean',
  ];

  const {registerJobSeeker} = useContext(AuthContext)

  const handleSubmit = async e => {
    e.preventDefault()
    registerJobSeeker(user)
  }

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
    console.log(user)
  }

  const handleDateChange = (date, dateString) => {
    setUser({
      ...user,
      dob: date
    })
  }

  return (
    <>
      <div className='h-screen flex items-center justify-center'>
        <Card>
          <CardHeader className='flex items-center mt-4'>
            <CardTitle>Register as a Job Seeker</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className='mt-4'>
                <Label htmlFor='email'>Email</Label>
                <Input type='email' id='email' onChange={handleChange} />
              </div>
              <div className='flex space-x-4'>
                <div className='mt-4'>
                  <Label htmlFor='password'>Password</Label>
                  <Input type='password' id='password' onChange={handleChange} />
                </div>
                <div className='mt-4'>
                  <Label htmlFor='password2'>Confirm Password</Label>
                  <Input type='password' id='password2' onChange={handleChange} />
                </div>
              </div>
              <div className='flex space-x-4 mt-4'>
                <div className='w-1/2'>
                  <Label htmlFor='firstName'>First Name</Label>
                  <Input type='text' id='firstName' onChange={handleChange}/>
                </div>
                <div className='w-1/2'>
                  <Label htmlFor='lastName'>Last Name</Label>
                  <Input type='text' id='lastName' onChange={handleChange} />
                </div>
              </div>
              <div className='mt-4'>
                <Label htmlFor='otherNames'>Other Names</Label>
                <Input type='text' id='otherNames' onChange={handleChange} />
              </div>
              <div className='mt-4'>
                <Label htmlFor='dob'>Date of Birth</Label>
                <div className='mt-2'>
                  <DatePicker className='w-full' onChange={handleDateChange} />
                </div>
              </div>        
              <div className='mt-4'>
                <Label htmlFor='phoneNumber'>Phone Number</Label>
                <Input type='text' id='phoneNumber' onChange={handleChange} />
              </div>
              <div className='mt-4'>
                <Label htmlFor='nationality'>Nationality</Label>
                <div className='mt-2'>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalityOptions.map((option, index) => (
                        <SelectItem key={index} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='mt-4'>
                <Label htmlFor='sex'>Gender</Label>
                <RadioGroup onChange={e => {setUser({...user, sex: e.target.value})}}>
                  <div className="flex space-x-4 mt-2">
                    <div className="flex flex-row space-x-2">
                      <RadioGroupItem value="M" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <RadioGroupItem value="F" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <div className='mt-4'>
                <Button type='submit' className='w-full mt-4'>Register</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default JobSeekerRegister
