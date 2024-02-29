import React, { useState, useContext }from 'react'
import { Link } from 'react-router-dom';
import AuthContext from '../../../../context/AuthContext';

const JobSeekerRegister = () => {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [otherNames, setOtherNames] = useState("")
  const [dob, setDob] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [nationality, setNationality] = useState("")
  const [sex, setSex] = useState("")
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
    registerJobSeeker(email, password, password2, firstName, lastName, otherNames, dob, phoneNumber, nationality, sex)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="email">email</label>
          <input
            name='email'
            type="email"
            id="email"
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            name='password'
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            name='password2'
            type='password'
            id='password2'
            onChange={e => setPassword2(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='first_name'>First Name</label>
          <input 
            name='first_name'
            type='text'
            id='firstName'
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='last_name'>Last Name</label>
          <input 
            name='last_name'
            type='text'
            id='lastName'
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='other_names'>Other Names</label>
          <input 
            name='other_names'
            type='text'
            id='otherNames'
            onChange={e => setOtherNames(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor='dob'>Date of Birth</label>
          <input 
            name='dob'
            type='date'
            id='dob'
            onChange={e => setDob(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor='phone_number'>Phone Number</label>
          <input 
            name='phone_number'
            type='tel'
            id='phoneNumber'
            onChange={e => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='nationality'>Nationality</label>
          <select
            name="nationality"
            id="nationality"
            onChange={e => setNationality(e.target.value)}
            value={nationality}
            required
          >
            <option value="" disabled>
              Select Nationality
            </option>
            {nationalityOptions
              .filter((option) =>
                option.toLowerCase().includes(nationality.toLowerCase())
              )
              .map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor='sex'>Sex</label>
          <input 
            name='sex'
            type='text'
            id='sex'
            onChange={e => setSex(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="button primary">Register</button>
          <button type="button" className="button secondary">Cancel</button>
          <Link to='/login'>Have an account? Click here to log in</Link>
        </div>
      </form>
    </div>
  )
}

export default JobSeekerRegister
