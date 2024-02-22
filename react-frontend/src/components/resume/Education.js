import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from './notificationUtils';


function Education({ resumeId }) {
    const defaultEducationState = {
        start_date : '',
        end_date : '',
        level:'',
        institution:'',
        grade:'',
        address:{
            city:'',
            post_code:'',
            country:''
        }
    };

    const [educations, setEducations] = useState([]);
    const [education, setEducation] = useState(defaultEducationState);
    const [errors, setErrors] = useState(defaultEducationState);

    useEffect(() => {
        if (!resumeId) {return;}
        AxiosInstance.get(`api/resumes/${resumeId}/educations/`)
            .then((response) => {setEducations(response.data)})
            .catch((error) => console.error('Error:', error));

    }, [resumeId]);

    const handleEducationChange = (event) => {
        const { name, value } = event.target;
        if (name.includes("address")) {
          const addressField = name.split(".")[1]; // Extract the address field name
          setEducation({...education,
            address: {
                ...education.address, 
                [addressField]: value, },
            });
        } else {
            setEducation({...education,[name]: value,});
        }
      };
    
        const handleSubmitEducations = (event) => {
            event.preventDefault();
            AxiosInstance.post(`api/resumes/${resumeId}/educations/create/`,education
            ).then((response) => {
                const newEducation = response.data
                showSuccess('Education Added');
                setEducation(defaultEducationState);
                setErrors(defaultEducationState);
                setEducations(prevEducations => [...prevEducations, newEducation]);
              
            }).catch((error) => {
                console.error('Error:', error);
                let errorMessages = '';
                if (error.response && error.response.data) {
                    errorMessages = Object.values(error.response.data).join(' ');
                    setErrors(error.response.data);
                };
                showError('Creating Education Failed');
            });
          
          };

          //Delete education
        const handleDeleteEducation = (educationObj) => {
          console.log(educationObj);
          AxiosInstance.delete(`http://localhost:8000/api/resumes/${resumeId}/educations/update/${educationObj.id}`)
          .then((response) => {
              showSuccess('Education Deleted');
              setEducations(prevEducations => prevEducations.filter(item => item !== educationObj));
          }).catch((error) => {
              console.error('Error:', error);
              showError('Deleting Education Failed');
          });
      }

      
    
        return (
            <div>
                <h2>Education</h2>
                <ul>
                {educations.map((education, index) => (
                <li key={index}>
                    <p>start date: {education.start_date}</p>
                    <p>end:date :  {education.end_date}</p>
                    <p>level: {education.level}</p>
                    <p>institution :  {education.institution}</p>
                    <p>grade: {education.grade}</p>
                    {education.address && ( 
                        <>
                        <p>City: {education.address.city}</p>
                        <p>Post Code: {education.address.post_code}</p>
                        <p>Country: {education.address.country}</p>
                        </>
                    )}
                <Link to={`/job-seeker/education/update/${education.id}`} state={{resumeId:resumeId, defaultEducationState:defaultEducationState}}>Update</Link>
                <button onClick={() => handleDeleteEducation(education)}>Delete</button>
                </li>
                ))}
                </ul>


                <form onSubmit={handleSubmitEducations}>
                <div>
                    <label>
                    start date:
                    <input type="date" name="start_date" value={education.start_date} onChange={handleEducationChange} />
                    {errors.start_date && <p>{errors.start_date}</p>}
                    </label>
                    <label>
                    end date:
                    <input type="date" name="end_date" value={education.end_date} onChange={handleEducationChange} />
                    {errors.end_date && <p>{errors.end_date}</p>}
                    </label>
                </div>
                <div>
                    <label>
                    level:
                    <select name="level" value={education.level} onChange={handleEducationChange}>
                    <option value="">Select level</option>
                    <option value="HS">High School</option>
                    <option value="BA">Bachelors</option>
                    <option value="MA">Masters</option>
                    <option value="PHD">Doctorate</option>
                    </select>
                    {errors.level && <p>{errors.level}</p>}
                    </label>
                </div>
                <label>
                    institution:
                    <input type="text" name="institution" value={education.institution} onChange={handleEducationChange} />
                    {errors.institution && <p>{errors.institution}</p>}
                    </label>
                    <label>
                    grade:
                    <input type="text" name="grade" value={education.grade} onChange={handleEducationChange} />
                    {errors.grade && <p>{errors.grade}</p>}
                    </label>

                    <h3>ADDRESS</h3>
                    <label>
                    city:
                    <input type="text" name="address.city" value={education.address.city} onChange={handleEducationChange} />
                    {errors.address && errors.address.city && <p>{errors.address.city}</p>}
                    </label>
                    <label>
                    post code:
                    <input type="text" name="address.post_code" value={education.address.post_code} onChange={handleEducationChange} />
                    {errors.address && errors.address.post_code && <p>{errors.address.post_code}</p>}
                    </label>

                    <label>
                    country:
                    <input type="text" name="address.country" value={education.address.country} onChange={handleEducationChange} />
                    {errors.address && errors.address.country && <p>{errors.address.country}</p>}
                    </label>
                
                <button type="submit">Add Education</button>
                </form>
            </div>
        )

}
export default Education;