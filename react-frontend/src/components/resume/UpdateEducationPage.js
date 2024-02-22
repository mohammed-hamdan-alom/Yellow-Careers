import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AxiosInstance from '../../Axios';
import { showError, showSuccess } from './notificationUtils';


function UpdateEducationPage() {
    const{id} = useParams();    
    const navigate = useNavigate()
    const defaultEducationState = useLocation().state.defaultEducationState
    const resumeId = useLocation().state.resumeId
    const [errors, setErrors] = useState(defaultEducationState);
    const [education, setEducation] = useState(defaultEducationState);

    useEffect(() => {
        AxiosInstance.get(`api/resumes/${resumeId}/educations/update/${id}`)
        .then(res => {setEducation(res.data)})
        .catch(err => console.error(err))
    }, [])

    const handleChange = (event) => {
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
          setEducation({...education,[name]: value,});}
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        AxiosInstance.put(`api/resumes/${resumeId}/educations/update/${id}`, education)
        .then(res =>{
            showSuccess("Education Updated")
            navigate(-1);
            setErrors(defaultEducationState);
            setEducation(defaultEducationState);

        })
        .catch((error) => {
            console.error(error)
            let errorMessages = '';
            if (error.response && error.response.data) {
                errorMessages = Object.values(error.response.data).join(' ');
                setErrors(error.response.data);
            };
            showError('Updating Education Failed');
        })
        
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Start Date</label>
                    <input type="date" name="start_date" value={education.start_date} onChange={handleChange}/>
                    {errors.start_date && <p>{errors.start_date}</p>}
                </div>
                <div>
                    <label>End Date</label>
                    <input type="date" name="end_date" value={education.end_date} onChange={handleChange}/>
                    {errors.end_date && <p>{errors.end_date}</p>}

                </div>
                <div>
                    <label>level:</label>
                    <select name="level" value={education.level} onChange={handleChange}>
                        <option value="">Select Level</option>
                        <option value="HS">High School</option>
                        <option value="BA">Bachelors</option>
                        <option value="MA">Masters</option>
                        <option value="PHD">Doctorate</option>
                    </select>
                    {errors.level && <p>{errors.level}</p>}
                </div>
                <div>
                    <label>institution</label>
                    <input type="text" name="institution" value={education.institution} onChange={handleChange}/>
                    {errors.institution && <p>{errors.institution}</p>}
                </div>
                <div>
                    <label>grade</label>
                    <input type="text" name="grade" value={education.grade} onChange={handleChange}/>
                    {errors.grade && <p>{errors.grade}</p>}
                </div>
                {education.address && ( 
                        <>
                        <div>
                            <label>city</label>
                            <input type="text" name="address.city" value={education.address.city} onChange={handleChange}/>
                            {errors.address && errors.address.city && <p>{errors.address.city}</p>}
                        </div>
                        <div>
                            <label>post code</label>
                            <input type="text" name="address.post_code" value={education.address.post_code} onChange={handleChange}/>
                            {errors.address && errors.address.post_code && <p>{errors.address.post_code}</p>}
                        </div>
                        <div>
                            <label>country</label>
                            <input type="text" name="address.country" value={education.address.country} onChange={handleChange}/>
                            {errors.address && errors.address.country && <p>{errors.address.country}</p>}
                        </div>
                        </>
                    )}
                 <br />
                <button> Update</button>
            </form>
        </div>
    )
}

export default UpdateEducationPage;