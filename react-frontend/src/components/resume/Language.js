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

    //Delete language
    const handleDeleteLanguage = (languageObj) => {
        console.log(languageObj);
        AxiosInstance.delete(`http://localhost:8000/api/resumes/${resumeId}/languages/update/${languageObj.id}`)
        .then((response) => {
            showSuccess('Language Deleted');
            setLanguages(prevLanguages => prevLanguages.filter(item => item !== languageObj));
        }).catch((error) => {
            console.error('Error:', error);
            showError('Deleting Language Failed');
        });
    }

    const [editingLanguageId, setEditingLanguageId] = useState(null); // State to track which language is being edited

    const LanguageInput = ({ value, onChange }) => (
        <input
            type="text"
            value={value}
            onChange={onChange}
        />
    );
    
    const handleUpdateLanguage = (languageObj) => {
        setEditingLanguageId(languageObj.id); // Set the id of the language being edited
    };
    
    const handleFieldChange = (languageObj, field, newValue) => {
        setLanguages(prevLanguages => prevLanguages.map(item => {
            if (item.id === languageObj.id) {
                return { ...item, [field]: newValue };
            }
            return item;
        }));
    };
    
    const handleSaveLanguage = (languageObj) => {
        // Perform the save operation similar to the previous logic
        
        AxiosInstance.put(`http://localhost:8000/api/resumes/${resumeId}/languages/update/${languageObj.id}`, languageObj)
            .then((response) => {
                const updatedLanguage = response.data;
                setLanguages(prevLanguages => prevLanguages.map(item => {
                    if (item.id === updatedLanguage.id) {
                        return updatedLanguage;
                    }
                    return item;
                }));
                setEditingLanguageId(null); // Reset editing state
                showSuccess('Language Updated');
            })
            .catch((error) => {
                console.error('Error:', error);
                showError('Updating Language Failed');
            });
    };
    

    return (
        <div>
            <h2>Languages</h2>
            <ul>
            {languages.map((languageObj, index) => (
                <li key={index}>
                    <div>
                        <p>
                            Language: {editingLanguageId === languageObj.id ? (
                                <LanguageInput
                                    value={languageObj.language}
                                    onChange={(e) => handleFieldChange(languageObj, 'language', e.target.value)}
                                />
                            ) : (
                                languageObj.language
                            )}
                        </p>
                        <p>
                            Spoken proficiency: {editingLanguageId === languageObj.id ? (
                                <LanguageInput
                                    value={languageObj.spoken_proficiency}
                                    onChange={(e) => handleFieldChange(languageObj, 'spoken_proficiency', e.target.value)}
                                />
                            ) : (
                                languageObj.spoken_proficiency
                            )}
                        </p>
                        <p>
                            Written proficiency: {editingLanguageId === languageObj.id ? (
                                <LanguageInput
                                    value={languageObj.written_proficiency}
                                    onChange={(e) => handleFieldChange(languageObj, 'written_proficiency', e.target.value)}
                                />
                            ) : (
                                languageObj.written_proficiency
                            )}
                        </p>
                        {editingLanguageId === languageObj.id ? (
                            <button onClick={() => handleSaveLanguage(languageObj)}>Save</button>
                        ) : (
                            <button onClick={() => handleUpdateLanguage(languageObj)}>Update</button>
                        )}
                    </div>
                    <button onClick={() => handleDeleteLanguage(languageObj)}>Delete</button>
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