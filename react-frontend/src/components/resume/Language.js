import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from './notificationUtils';



function Language({resumeId,}) {
    const defaultLanguageState = {
        language: '',
        spoken_proficiency: '',
        written_proficiency: '',
    };

    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState(defaultLanguageState);
    const [errors, setErrors] = useState(defaultLanguageState);

    useEffect(() => {
        if (!resumeId) {return;}
        AxiosInstance.get(`api/resumes/${resumeId}/languages/`)
            .then((response) => {setLanguages(response.data)})
            .catch((error) => console.error('Error:', error));
    }, [resumeId]);

    const handleLanguageChange = (event) => {
        setLanguage({
          ...language,
          [event.target.name]: event.target.value
        }
        )};

    const handleSubmitLanguages = (event) => {
        event.preventDefault();
        AxiosInstance.post(`api/resumes/${resumeId}/languages/create/`, language
        ).then((response) => {
            console.log('Success: ',response);
            showSuccess('Language Added');
            setLanguage(defaultLanguageState);
            setErrors(defaultLanguageState);
            setLanguages(prevLanguages => [...prevLanguages, language]);
      
        }).catch((error) => {
            console.error('Error:', error);
            let errorMessages = '';
            if (error.response && error.response.data) {
              errorMessages = Object.values(error.response.data).join(' ');
              setErrors(error.response.data);};
            showError('Creating Language Failed');
        });
      
    };

    //Delete language
    const handleDeleteLanguage = (languageObj) => {
        console.log(languageObj);
        AxiosInstance.delete(`api/resumes/${resumeId}/languages/update/${languageObj.id}`)
        .then((response) => {
            showSuccess('Language Deleted');
            setLanguages(prevLanguages => prevLanguages.filter(item => item !== languageObj));
        }).catch((error) => {
            console.error('Error:', error);
            showError('Deleting Language Failed');
        });
    }
    

    return (
        <div>
            <h2>Languages</h2>
            <ul>
            {languages.map((language, index) => (
            <li key={index}>
                <p>Language: {language.language}</p>
                <p>Spoken proficiency: {language.spoken_proficiency}</p>
                <p>Written proficiency: {language.written_proficiency}</p>
                <Link to={`/job-seeker/language/update/${language.id}`} state={{resumeId:resumeId,defaultLanguageState:defaultLanguageState}}>Update</Link>
                <button onClick={() => handleDeleteLanguage(language)}>Delete</button>
            </li>
            ))}
            </ul>
            <form onSubmit={handleSubmitLanguages}>
            <div>
                <label>
                Language:
                <input type="text" name="language" value={language.language} onChange={handleLanguageChange} />
                {errors.language && <p>{errors.language}</p>}
                </label>
            </div>
            <div>
                <label>
                Spoken Proficiency:
                <select name="spoken_proficiency" value={language.spoken_proficiency} onChange={handleLanguageChange}>
                <option value="">Select Proficiency</option>
                <option value="B">Basic</option>
                <option value="I">Intermediate</option>
                <option value="A">Advanced</option>
                <option value="F">Fluent</option>
                </select>
                {errors.spoken_proficiency && <p>{errors.spoken_proficiency}</p>}
                </label>
            </div>
            <div>
                <label>
                Written Proficiency:
                <select name="written_proficiency" value={language.written_proficiency} onChange={handleLanguageChange}>
                <option value="">Select Proficiency</option>
                <option value="B">Basic</option>
                <option value="I">Intermediate</option>
                <option value="A">Advanced</option>
                <option value="F">Fluent</option>
                </select>
                {errors.written_proficiency && <p>{errors.written_proficiency}</p>}
                </label>
            </div>
            <button type="submit">Add Language</button>
            </form>
        </div>
    );
}

export default Language;