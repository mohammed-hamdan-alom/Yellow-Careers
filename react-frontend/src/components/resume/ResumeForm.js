import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';

function ResumeForm ({ resumeId, showError, showSuccess }) {

    const defaultResumeState = {
        github: '',
        linkedin: '',
        about: '',
        experience: '',
      };

    
    const [resume, setResume] = useState(defaultResumeState);
    const [errors, setErrors] = useState(defaultResumeState);

    useEffect(() => {
        if (!resumeId) {return;}
        AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/update/`)
            .then((response) => {setResume(response.data)})
            .then((response) => console.log(response))
            .catch((error) => console.error('Error:', error));
    }, [resumeId]);

    const handleResumeChange = (event) => {
        setResume({
          ...resume,
          [event.target.name]: event.target.value
        });
    };

    const handleSubmitResume = (event) => {
        event.preventDefault();
        AxiosInstance.put(`http://localhost:8000/api/resumes/${resumeId}/update/`, {
            github: resume.github,
            linked: resume.linkedin,
            about: resume.about,
            experience: resume.experience,
        }).then((response) => {
            showSuccess('Resume Updated');
          setErrors(defaultResumeState);
    
        }).catch((error) => {
            console.error('Error:', error);
            let errorMessages = '';
            if (error.response && error.response.data) {
              // Parse the error response
              errorMessages = Object.values(error.response.data).join(' ');
              setErrors(error.response.data);};
            showError('Updating Resume Failed');
        });
    
    };


    return (
        <div>
            <h2>Resume Info</h2>
            <form onSubmit={handleSubmitResume}>
                <div>
                    <label>
                    GitHub:
                    <input type="text" name="github" value={resume.github} onChange={handleResumeChange} />
                    {errors.github && <p>{errors.github}</p>}
                    </label>
                </div>
                <div>
                    <label>
                    LinkedIn:
                    <input type="text" name="linkedin" value={resume.linkedin} onChange={handleResumeChange} />
                    {errors.linkedin && <p>{errors.linkedin}</p>}
                    </label>
                </div>
                <div>
                    <label>
                    About:
                    <textarea name="about" value={resume.about} onChange={handleResumeChange} />
                    {errors.about && <p>{errors.about}</p>}
                    </label>
                </div>
                <div>
                    <label>
                    Experience:
                    <textarea name="experience" value={resume.experience} onChange={handleResumeChange} />
                    {errors.experience && <p>{errors.experience}</p>}
                    </label>
                </div>
                <button type="submit">Update Resume</button>
            </form>
        </div>
    );
};

export default ResumeForm;