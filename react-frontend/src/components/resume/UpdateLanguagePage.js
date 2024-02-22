import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { showError, showSuccess } from './notificationUtils';


function UpdateLanguagePage() {
    const{id} = useParams();
    const [values, setValues] = useState({
        id:id,
        language:'',
        spoken_proficiency:'',
        written_proficiency:''
    })
    const location = useLocation()
    const resumeId = location.state.resumeId
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/resumes/${resumeId}/languages/update/${id}`)
        .then(res => {
            setValues({
                ...values, language:res.data.language,
                spoken_proficiency:res.data.spoken_proficiency,
                written_proficiency:res.data.written_proficiency
            })
        })
        .catch(err => console.log(err))
    }, [])

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://127.0.0.1:8000/api/resumes/${resumeId}/languages/update/${id}`, values)
        .then(res =>{
            navigate(-1);
            showSuccess("Language Updated")
        })
        .catch(err => console.log(err))
        showError('Updating Language Failed');
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Language</label>
                    <input type="text" value={values.language} onChange={e => setValues({...values, language:e.target.value})}/>
                </div>
                <div>
                    <label>Spoken Proficiency:</label>
                    <select name="spoken_proficiency" value={values.spoken_proficiency} onChange={e => setValues({...values, spoken_proficiency:e.target.value})}>
                        <option value="">Select Proficiency</option>
                        <option value="B">Basic</option>
                        <option value="I">Intermediate</option>
                        <option value="A">Advanced</option>
                        <option value="F">Fluent</option>
                    </select>
                </div>
                <div>
                    <label>Written Proficiency:</label>
                    <select name="written_proficiency" value={values.written_proficiency} onChange={e => setValues({...values, written_proficiency:e.target.value})}>
                        <option value="">Select Proficiency</option>
                        <option value="B">Basic</option>
                        <option value="I">Intermediate</option>
                        <option value="A">Advanced</option>
                        <option value="F">Fluent</option>
                    </select>
                </div> <br />
                <button> Update</button>
            </form>
        </div>
    )
}

export default UpdateLanguagePage;