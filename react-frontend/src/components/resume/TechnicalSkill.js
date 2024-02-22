import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';
import { showError, showSuccess } from './notificationUtils';


function TechnicalSkill({ resumeId,}) {
    const [technicalSkills, setTechnicalSkills] = useState([]);
    const [technicalSkill, setTechnicalSkill] = useState([]);
    const [errors, setErrors] = useState({technicalSkill: ''});

    // Fetch technical skills
    useEffect(() => {
        if (!resumeId) {return;}
        AxiosInstance.get(`api/resumes/${resumeId}/technical-skills/`)
            .then((response) => {setTechnicalSkills(response.data)})
            .catch((error) => console.error('Error:', error));
    }, [resumeId]);

    const handleTechnicalSkillChange = (event) => {setTechnicalSkill(event.target.value);};
    
    //Create technical skill
    const handleSubmitTechnicalSkills = (event) => {
        event.preventDefault();
        AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/technical-skills/create/`, {
            skill:technicalSkill
        }).then((response) => {
            showSuccess('Technical Skill Added');
            setTechnicalSkill('');
            setErrors({technicalSkill: '',});
            setTechnicalSkills(prevTechnicalSkills => [...prevTechnicalSkills, response.data]);
            }).catch((error) => {
                console.error('Error:', error);
                let errorMessages = '';
                if (error.response && error.response.data) {
                    errorMessages = Object.values(error.response.data).join(' ');
                    setErrors({ technicalSkill: error.response.data.skill[0]});
                };
                showError('Creating Technical Skill Failed');
            });
    };

    //Delete technical skill
    const handleDeleteTechnicalSkill = (skillObj) => {
        console.log(skillObj);
        AxiosInstance.delete(`api/resumes/${resumeId}/technical-skills/update/${skillObj.id}`)
        .then((response) => {
            showSuccess('Technical Skill Deleted');
            setTechnicalSkills(prevSoftSkills => prevSoftSkills.filter(item => item !== skillObj));
        }).catch((error) => {
            console.error('Error:', error);
            showError('Deleting Technical Skill Failed');
        });
    }

    return (
        <div>
            <h2>Technical Skills</h2>
            <ul>
            {technicalSkills.map((skillObj, index) => (<li key={index}>
                {skillObj.skill}
                <button onClick={() => handleDeleteTechnicalSkill(skillObj)}>Delete</button>
                </li>))}
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