import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';

function Language({ resumeId, showError, showSuccess }) {
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
        AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/languages/`)
            .then((response) => {setLanguages(response.data)})
            .then((response) => console.log(response))
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
        AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/languages/create/`, {
            language:language.language,
            spoken_proficiency:language.spoken_proficiency,
            written_proficiency:language.written_proficiency
        }).then((response) => {
            console.log('Success: ',response);
            showSuccess('Language Added');
            setLanguage(defaultLanguageState);
            setErrors(defaultLanguageState);
            setLanguages(prevLanguages => [...prevLanguages, language]);
      
        }).catch((error) => {
            console.error('Error:', error);
            let errorMessages = '';
            if (error.response && error.response.data) {
              // Parse the error response
              // TODO: Doesnt show error properly
              errorMessages = Object.values(error.response.data).join(' ');
              setErrors(error.response.data);};
            showError('Creating Language Failed');
        });
      
    };

    return (
        <div>
            <h2>Languages</h2>
            <ul>
            {languages.map((language, index) => (
            <li key={index}>
                <p>Language: {language.language}</p>
                <p>Spoken proficiency: {language.spoken_proficiency}</p>
                <p>Written proficiency: {language.written_proficiency}</p>
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