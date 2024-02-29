import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AxiosInstance from '../../../Axios';

const ResumeDisplay = ({ resume }) => {

    const [softSkill, setSoftSkill] = useState([]);
    const [technicalSkill, setTechnicalSkill] = useState([]);
    const [education, setEducation] = useState([]);


    useEffect(() => {
        if (resume && resume.id) {
            Promise.all([
                AxiosInstance.get(`api/resumes/${resume.id}/softskill/`),
                AxiosInstance.get(`api/resumes/${resume.id}/technicalskill/`),
                AxiosInstance.get(`api/resumes/${resume.id}/education/`)
            ])
                .then((responses) => {
                    setSoftSkill(responses[0].data);
                    setTechnicalSkill(responses[1].data);
                    setEducation(responses[2].data);
                })
                .catch((error) => console.error('Error retrieving data:', error))
        }
    }, [resume]);

    return (
        <div>
            <h4>Soft Skills:</h4>
            <h5>{softSkill.map(skill => (
                <div key={skill.id}>
                    <p>{skill.skill}</p>
                    <br />
                </div>
            ))}</h5>
            <h4>Technical Skills:</h4>
            <h5>{technicalSkill.map(skill => (
                <div key={skill.id}>
                    <p>{skill.skill}</p>
                    <br />
                </div>
            ))}</h5>
            <h4>Education:</h4>
            {education.map(edu => (
                <ul key={edu.id}>
                    <>
                        <h5>Institution: {edu.institution}</h5>
                        <p>Level: {edu.level}</p>
                        <p>Grade: {edu.grade}</p>
                        <p>Start Date: {edu.start_date}</p>
                        <p>End Date: {edu.end_date}</p>
                        <br />
                    </>
                </ul>))}
        </div>
    );
};

export default ResumeDisplay;