import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';

function Education({ resumeId, showError, showSuccess }) {
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
        AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/educations/`)
            .then((response) => {setEducations(response.data)})
            .then((response) => console.log(response))
            .catch((error) => console.error('Error:', error));

    }, [resumeId]);

    const handleEducationChange = (event) => {
        const { name, value } = event.target;
        if (name.includes("address")) {
          const addressField = name.split(".")[1]; // Extract the address field name
          setEducation({
            ...education,
            address: {
              ...education.address,
              [addressField]: value,
            },
          });
        } else {
          setEducation({
            ...education,
            [name]: value,
          });
        }
      };
    
        const handleSubmitEducations = (event) => {
            event.preventDefault();
            AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/educations/create/`, {
                start_date:education.start_date,
                end_date : education.end_date,
                level: education.level,
                institution: education.institution,
                grade: education.grade,
                address:{
                  city:education.address.city,
                  post_code:education.address.post_code,
                  country:education.address.country
                }
            }).then((response) => {
                console.log('Success: ',response);
                showSuccess('Education Added');
                setEducation(defaultEducationState);
                setErrors(defaultEducationState);
                setEducations(prevEducations => [...prevEducations, education]);
              
            }).catch((error) => {
                console.error('Error:', error);
                let errorMessages = '';
                if (error.response && error.response.data) {
                    // Parse the error response
                    // TODO: Doesnt show error properly
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

      //Update education
      const handleUpdateField = (educationObj, fieldName) => {
        const newValue = prompt(`Enter new value for ${fieldName}:`);
        if (newValue === null) return; 
    
        const updatedEducation = { ...educationObj, [fieldName]: newValue };
    
        AxiosInstance.put(`http://localhost:8000/api/resumes/${resumeId}/educations/update/${educationObj.id}`, updatedEducation)
            .then((response) => {
                const updatedEducation = response.data;
                setEducations(prevEducations => {
                    return prevEducations.map(item => {
                        if (item.id === updatedEducation.id) {
                            return updatedEducation;
                        } else {
                            return item;
                        }
                    });
                });
                showSuccess('Education Updated');
            })
            .catch((error) => {
                console.error('Error:', error);
                showError('Updating Education Failed');
            });
    };
    
        return (
            <div>
                <h2>Education</h2>
                <ul>
                    {educations.map((education, index) => (
                        <li key={index}>
                            <div>
                                <p>Start date: {education.start_date}</p>
                                <button onClick={() => handleUpdateField(education, 'start_date')}>Update Start Date</button>
                            </div>
                            <div>
                                <p>End date: {education.end_date}</p>
                                <button onClick={() => handleUpdateField(education, 'end_date')}>Update End Date</button>
                            </div>
                            <div>
                                <p>Level: {education.level}</p>
                                <button onClick={() => handleUpdateField(education, 'level')}>Update Level</button>
                            </div>
                            <div>
                                <p>Institution: {education.institution}</p>
                                <button onClick={() => handleUpdateField(education, 'institution')}>Update Institution</button>
                            </div>
                            <div>
                                <p>Grade: {education.grade}</p>
                                <button onClick={() => handleUpdateField(education, 'grade')}>Update Grade</button>
                            </div>
                            {education.address && (
                                <>
                                    <div>
                                        <p>City: {education.address.city}</p>
                                        <button onClick={() => handleUpdateField(education.address, 'city')}>Update City</button>
                                    </div>
                                    <div>
                                        <p>Post Code: {education.address.post_code}</p>
                                        <button onClick={() => handleUpdateField(education.address, 'post_code')}>Update Post Code</button>
                                    </div>
                                    <div>
                                        <p>Country: {education.address.country}</p>
                                        <button onClick={() => handleUpdateField(education.address, 'country')}>Update Country</button>
                                    </div>
                                </>
                            )}
                            <button onClick={() => handleDeleteEducation(education)}>Delete</button>
                        </li>
                    ))}
                </ul>


                <form onSubmit={handleSubmitEducations}>
                <div>
                    <label>
                    start date:
                    <input type="date" name="start_date" value={education.start_date} onChange={handleEducationChange} />
                    {errors.education && <p>{errors.education}</p>}
                    </label>
                    <label>
                    end date:
                    <input type="date" name="end_date" value={education.end_date} onChange={handleEducationChange} />
                    {errors.education && <p>{errors.education}</p>}
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
                    {errors.education && <p>{errors.education}</p>}
                    </label>
                </div>
                <label>
                    institution:
                    <input type="text" name="institution" value={education.institution} onChange={handleEducationChange} />
                    {errors.education && <p>{errors.education}</p>}
                    </label>
                    <label>
                    grade:
                    <input type="text" name="grade" value={education.grade} onChange={handleEducationChange} />
                    {errors.education && <p>{errors.education}</p>}
                    </label>

                    <h3>ADDRESS</h3>
                    <label>
                    city:
                    <input type="text" name="address.city" value={education.address.city} onChange={handleEducationChange} />
                    {errors.education && <p>{errors.education}</p>}
                    </label>
                    {/* I dont think these errors work */}
                    <label>
                    post code:
                    <input type="text" name="address.post_code" value={education.address.post_code} onChange={handleEducationChange} />
                    {errors.education && <p>{errors.education}</p>}
                    </label>

                    <label>
                    country:
                    <input type="text" name="address.country" value={education.address.country} onChange={handleEducationChange} />
                    {errors.education && <p>{errors.education}</p>}
                    </label>
                
                <button type="submit">Add Education</button>
                </form>
            </div>
        )

}
export default Education;