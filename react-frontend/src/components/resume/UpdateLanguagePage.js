import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AxiosInstance from '../../Axios';
import { showError, showSuccess } from './notificationUtils';


function UpdateLanguagePage() {
    const{id} = useParams();    
    const navigate = useNavigate()
    const defaultLanguageState = useLocation().state.defaultLanguageState
    const resumeId = useLocation().state.resumeId
    const [errors, setErrors] = useState(defaultLanguageState);

    const [language, setLanguage] = useState(defaultLanguageState);
    useEffect(() => {
        AxiosInstance.get(`api/resumes/${resumeId}/languages/update/${id}`)
        .then(res => {setLanguage(res.data)})
        .catch(err => console.error(err))
    }, [])


    const handleChange = (event) => {
        setLanguage({...language, [event.target.name]: event.target.value})};

    const handleSubmit = (e) => {
        e.preventDefault();
        AxiosInstance.put(`api/resumes/${resumeId}/languages/update/${id}`, language)
        .then(res =>{
            navigate(-1);
            showSuccess("Language Updated")
            setErrors(defaultLanguageState);
            setLanguage(defaultLanguageState);
        })
        .catch((error) => {
            console.error(error)
            let errorMessages = '';
            if (error.response && error.response.data) {
                errorMessages = Object.values(error.response.data).join(' ');
                setErrors(error.response.data);
            };
            showError('Updating Language Failed');
        })
        
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Language</label>
                    <input type="text" name= "language" value={language.language} onChange={handleChange}/>
                    {errors.language && <p>{errors.language}</p>}
                </div>
                <div>
                    <label>Spoken Proficiency:</label>
                    <select name="spoken_proficiency" value={language.spoken_proficiency} onChange={handleChange}>
                        <option value="">Select Proficiency</option>
                        <option value="B">Basic</option>
                        <option value="I">Intermediate</option>
                        <option value="A">Advanced</option>
                        <option value="F">Fluent</option>
                    </select>
                    {errors.spoken_proficiency && <p>{errors.spoken_proficiency}</p>}
                </div>
                <div>
                    <label>Written Proficiency:</label>
                    <select name="written_proficiency" value={language.written_proficiency} onChange={handleChange}>
                        <option value="">Select Proficiency</option>
                        <option value="B">Basic</option>
                        <option value="I">Intermediate</option>
                        <option value="A">Advanced</option>
                        <option value="F">Fluent</option>
                    </select>
                    {errors.written_proficiency && <p>{errors.written_proficiency}</p>}
                </div> <br />
                <button> Update</button>
            </form>
        </div>
    )
}

export default UpdateLanguagePage;