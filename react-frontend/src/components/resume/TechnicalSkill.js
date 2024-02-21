import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';

function TechnicalSkill({ resumeId, showError, showSuccess }) {
    const [technicalSkills, setTechnicalSkills] = useState([]);
    const [technicalSkill, setTechnicalSkill] = useState([]);
    const [errors, setErrors] = useState({technicalSkill: ''});

    useEffect(() => {
        if (!resumeId) {return;}
        AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/technical-skills/`)
            .then((response) => {setTechnicalSkills(response.data.map(item => item.skill))})
            .then((response) => console.log(response))
            .catch((error) => console.error('Error:', error));
    }, [resumeId]);

    const handleTechnicalSkillChange = (event) => {
        setTechnicalSkill(event.target.value);
        };
    
    const handleSubmitTechnicalSkills = (event) => {
        event.preventDefault();
        AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/technical-skills/create/`, {
            skill:technicalSkill
        }).then((response) => {
            console.log('Success: ',response);
            showSuccess('Technical Skill Added');
            setTechnicalSkill('');
            setErrors({technicalSkill: '',});
            setTechnicalSkills(prevTechnicalSkills => [...prevTechnicalSkills, technicalSkill]);
            }).catch((error) => {
                console.error('Error:', error);
                let errorMessages = '';
                if (error.response && error.response.data) {
                    // Parse the error response
                    // TODO: Doesnt show error properly
                    errorMessages = Object.values(error.response.data).join(' ');
                    setErrors(error.response.data);
                };
                showError('Creating Technical Skill Failed');
            });
    };
    return (
        <div>
            <h2>Technical Skills</h2>
            <ul>
            {technicalSkills.map((skill, index) => (<li key={index}>{skill}</li>))}
            </ul>
            <form onSubmit={handleSubmitTechnicalSkills}>
            <div>
                <label>
                Technical Skill:
                <input type="text" name="technicalSkill" value={technicalSkill} onChange={handleTechnicalSkillChange} />
                {errors.technicalSkill && <p>{errors.technicalSkill}</p>}
                </label>
            </div>
            <button type="submit">Add Technical Skill</button>
            </form>
        </div>
    )
}
export default TechnicalSkill;

    

