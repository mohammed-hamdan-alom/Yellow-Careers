import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';

function SoftSkill({ resumeId, showError, showSuccess }) {
    const [softSkills, setSoftSkills] = useState([]);
    const [softSkill, setSoftSkill] = useState([]);
    const [errors, setErrors] = useState({softSkill: ''});

    useEffect(() => {
        if (!resumeId) {return;}
        AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/soft-skills/`)
            .then((response) => {setSoftSkills(response.data.map(item => item.skill))})
            .then((response) => console.log(response))
            .catch((error) => console.error('Error:', error));
    }, [resumeId]);

    const handleSoftSkillChange = (event) => {
        setSoftSkill(event.target.value);
      };
    
    const handleSubmitSoftSkills = (event) => {
        event.preventDefault();
        AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/soft-skills/create/`, {
            skill:softSkill
        }).then((response) => {
            console.log('Success: ',response);
            showSuccess('Soft Skill Added');
            setSoftSkill('');
            setErrors({softSkill: '',});
            setSoftSkills(prevSoftSkills => [...prevSoftSkills, softSkill]);
            }).catch((error) => {
                console.error('Error:', error);
                let errorMessages = '';
                if (error.response && error.response.data) {
                    // Parse the error response
                    // TODO: Doesnt show error properly
                    errorMessages = Object.values(error.response.data).join(' ');
                    setErrors(error.response.data);
                };
            showError('Creating Soft Skill Failed');
        });
    };

    return (
        <div>
            <h2>Soft Skills</h2>
            <ul>
            {softSkills.map((skill, index) => (<li key={index}>{skill}</li>))}
            </ul>
            <form onSubmit={handleSubmitSoftSkills}>
            <div>
                <label>
                Soft Skill:
                <input type="text" name="softSkill" value={softSkill} onChange={handleSoftSkillChange} />
                {errors.softSkill && <p>{errors.softSkill}</p>}
                </label>
            </div>
            <button type="submit">Add Soft Skill</button>
            </form>
        </div>
    )
}
export default SoftSkill;