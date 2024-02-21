import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';

function ProfessionalExperience({ resumeId, showError, showSuccess }) {
    const defaultExperienceState = {
        start_date:'',
        end_date:'',
        company:'',
        position:'',
        description:'',
        address:{
            city:'',
            post_code:'',
            country:''
        }
    }
    const [professionalExperiences, setProfessionalExperiences] = useState([]);
    const [professionalExperience, setProfessionalExperience] = useState(defaultExperienceState);
    const [errors, setErrors] = useState(defaultExperienceState);

    useEffect(() => {
        if (!resumeId) {return;}
        AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/professional-experiences/`)
            .then((response) => {setProfessionalExperiences(response.data)})
            .then((response) => console.log(response))
            .catch((error) => console.error('Error:', error));
    }, [resumeId]);

    const handleProfessionalExperienceChange = (event) => {
        const { name, value } = event.target;
        if (name.includes("address")) {
          const addressField = name.split(".")[1]; // Extract the address field name
          setProfessionalExperience({
            ...professionalExperience,
            address: {
              ...professionalExperience.address,
              [addressField]: value,
            },
          });
        } else {
          setProfessionalExperience({
            ...professionalExperience,
            [name]: value,
          });
        }
      };
    
    
    const handleSubmitProfessionalExperiences = (event) => {
        event.preventDefault();
        AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/professional-experiences/create/`, {
            start_date:professionalExperience.start_date,
            end_date : professionalExperience.end_date,
            company: professionalExperience.company,
            description: professionalExperience.description,
            address:{
                city:professionalExperience.address.city,
                post_code:professionalExperience.address.post_code,
                country:professionalExperience.address.country
            }
        }).then((response) => {
            console.log('Success: ',response);
            showSuccess('Professional Experience Added');
            setProfessionalExperience(defaultExperienceState);
            setErrors(defaultExperienceState);
            setProfessionalExperiences(prevProfessionalExperiences => [...prevProfessionalExperiences, professionalExperience]);
        
        }).catch((error) => {
            console.error('Error:', error);
            let errorMessages = '';
            if (error.response && error.response.data) {
                // Parse the error response
                // TODO: Doesnt show error properly
                errorMessages = Object.values(error.response.data).join(' ');
                setErrors(error.response.data);
            };
            showError('Creating Professional Experience Failed');
        });
    
    };

    return (
        <div>
            <h2>Professional Experience</h2>
            <ul>
            {professionalExperiences.map((professionalExperience, index) => (
            <li key={index}>
                <p>start date: {professionalExperience.start_date}</p>
                <p>end:date :  {professionalExperience.end_date}</p>
                <p>company: {professionalExperience.company}</p>
                <p>position :  {professionalExperience.position}</p>
                {professionalExperience.address && ( 
                    <>
                    <p>City: {professionalExperience.address.city}</p>
                    <p>Post Code: {professionalExperience.address.post_code}</p>
                    <p>Country: {professionalExperience.address.country}</p>
                    </>
                )}
            </li>
            ))}
            </ul>

            <form onSubmit={handleSubmitProfessionalExperiences}>
            <div>
                <label>
                start date:
                <input type="date" name="start_date" value={professionalExperience.start_date} onChange={handleProfessionalExperienceChange} />
                {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
                </label>
                <label>
                end date:
                <input type="date" name="end-date" value={professionalExperience.end_date} onChange={handleProfessionalExperienceChange} />
                {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
                </label>
            </div>
            <label>
                company:
                <input type="text" name="company" value={professionalExperience.company} onChange={handleProfessionalExperienceChange} />
                {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
                </label>
                <label>
                position:
                <input type="text" name="position" value={professionalExperience.position} onChange={handleProfessionalExperienceChange} />
                {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
                </label>
                <label>
                description:
                <input type="text" name="description" value={professionalExperience.description} onChange={handleProfessionalExperienceChange} />
                {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
                </label>

                <h3>ADDRESS</h3>
                <label>
                city:
                <input type="text" name="city" value={professionalExperience.address.city} onChange={handleProfessionalExperienceChange} />
                {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
                </label>

                <label>
                post code:
                <input type="text" name="post_code" value={professionalExperience.address.post_code} onChange={handleProfessionalExperienceChange} />
                {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
                </label>

                <label>
                country:
                <input type="text" name="country" value={professionalExperience.address.country} onChange={handleProfessionalExperienceChange} />
                {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
                </label>
            
            <button type="submit">Add professional experience</button>
            </form>
        </div>
    )


};
export default ProfessionalExperience;