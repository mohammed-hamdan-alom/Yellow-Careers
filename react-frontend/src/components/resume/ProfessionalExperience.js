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
            position: professionalExperience.position,
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
    
    //Delete a professional experience
    const handleDeleteProfessionalExperience = (professionalExperienceObj) => {
        console.log(professionalExperienceObj);
        AxiosInstance.delete(`http://localhost:8000/api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceObj.id}`)
        .then((response) => {
            showSuccess('Professional Experience Deleted');
            setProfessionalExperiences(prevprofessionalExperiences => prevprofessionalExperiences.filter(item => item !== professionalExperienceObj));
        }).catch((error) => {
            console.error('Error:', error);
            showError('Deleting Professional Experience Failed');
        });
    }

    //Update professional experience
    const handleUpdateField = (professionalExperienceObj, fieldName) => {
        const newValue = prompt(`Enter new value for ${fieldName}:`);
        if (newValue === null) return; 
    
        const updatedProfessionalExperience = { ...professionalExperienceObj, [fieldName]: newValue };
    
        AxiosInstance.put(`http://localhost:8000/api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceObj.id}`, updatedProfessionalExperience)
            .then((response) => {
                const updatedProfessionalExperience = response.data;
                setProfessionalExperiences(prevProfessionalExperiences => {
                    return prevProfessionalExperiences.map(item => {
                        if (item.id === updatedProfessionalExperience.id) {
                            return updatedProfessionalExperience;
                        } else {
                            return item;
                        }
                    });
                });
                showSuccess('Professional Experience Updated');
            })
            .catch((error) => {
                console.error('Error:', error);
                showError('Updating Professional Experience Failed');
            });
    };

    return (
        <div>
            <h2>Professional Experience</h2>
            <ul>
                {professionalExperiences.map((professionalExperience, index) => (
                    <li key={index}>
                        <div>
                            <p>Start date: {professionalExperience.start_date}</p>
                            <button onClick={() => handleUpdateField(professionalExperience, 'start_date')}>Update Start Date</button>
                        </div>
                        <div>
                            <p>End date: {professionalExperience.end_date}</p>
                            <button onClick={() => handleUpdateField(professionalExperience, 'end_date')}>Update End Date</button>
                        </div>
                        <div>
                            <p>Company: {professionalExperience.company}</p>
                            <button onClick={() => handleUpdateField(professionalExperience, 'company')}>Update Company</button>
                        </div>
                        <div>
                            <p>Position: {professionalExperience.position}</p>
                            <button onClick={() => handleUpdateField(professionalExperience, 'position')}>Update Position</button>
                        </div>
                        {professionalExperience.address && ( 
                            <>
                                <div>
                                    <p>City: {professionalExperience.address.city}</p>
                                    <button onClick={() => handleUpdateField(professionalExperience.address, 'city')}>Update City</button>
                                </div>
                                <div>
                                    <p>Post Code: {professionalExperience.address.post_code}</p>
                                    <button onClick={() => handleUpdateField(professionalExperience.address, 'post_code')}>Update Post Code</button>
                                </div>
                                <div>
                                    <p>Country: {professionalExperience.address.country}</p>
                                    <button onClick={() => handleUpdateField(professionalExperience.address, 'country')}>Update Country</button>
                                </div>
                            </>
                        )}
                        <button onClick={() => handleDeleteProfessionalExperience(professionalExperience)}>Delete</button>
                    </li>
                ))}
            </ul>


            <form onSubmit={handleSubmitProfessionalExperiences}>
            <div>
                <label>
                start date:
                <input type="date" name="start_date" value={professionalExperience.start_date} onChange={handleProfessionalExperienceChange} pattern="\d{4}-\d{2}-\d{2}"/>
                {errors.start_date && <p>{errors.start_date}</p>}
                </label>
                <label>
                end date:
                <input type="date" name="end_date" value={professionalExperience.end_date} onChange={handleProfessionalExperienceChange} pattern="\d{4}-\d{2}-\d{2}"/>
                {errors.end_date && <p>{errors.end_date}</p>}
                </label>
            </div>
            <label>
                company:
                <input type="text" name="company" value={professionalExperience.company} onChange={handleProfessionalExperienceChange} />
                {errors.company && <p>{errors.company}</p>}
                </label>
                <label>
                position:
                <input type="text" name="position" value={professionalExperience.position} onChange={handleProfessionalExperienceChange} />
                {errors.position && <p>{errors.position}</p>}
                </label>
                <label>
                description:
                <input type="text" name="description" value={professionalExperience.description} onChange={handleProfessionalExperienceChange} />
                {errors.description && <p>{errors.description}</p>}
                </label>

                <h3>ADDRESS</h3>
                <label>
                city:
                <input type="text" name="address.city" value={professionalExperience.address.city} onChange={handleProfessionalExperienceChange} />
                {errors.address && errors.address.city && <p>{errors.address.city}</p>}
                </label>

                <label>
                post code:
                <input type="text" name="address.post_code" value={professionalExperience.address.post_code} onChange={handleProfessionalExperienceChange} />
                {errors.address && errors.address.post_code && <p>{errors.address.post_code}</p>}
                </label>

                <label>
                country:
                <input type="text" name="address.country" value={professionalExperience.address.country} onChange={handleProfessionalExperienceChange} />
                {errors.address && errors.address.country && <p>{errors.address.country}</p>}
                </label>
            
            <button type="submit">Add professional experience</button>
            </form>
        </div>
    )


};
export default ProfessionalExperience;