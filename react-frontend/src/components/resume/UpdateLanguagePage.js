import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function UpdateLanguagePage() {
    const{id} = useParams();
    const [values, setValues] = useState({
        id:id,
        language:'',
        spoken_proficiency:'',
        written_proficiency:''
    })
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/resumes/39/languages/update/'+id)
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
        axios.put('http://127.0.0.1:8000/api/resumes/39/languages/update/'+id, values)
        .then(res =>{
            navigate(-1);
        })
        .catch(err => console.log(err))
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Language</label>
                    <input type="text" value={values.language} onChange={e => setValues({...values, language:e.target.value})}/>
                </div>
                <div>
                    <label>Spoken proficiency:</label>
                    <input type="text" value={values.spoken_proficiency} 
                    onChange={e => setValues({...values, spoken_proficiency:e.target.value})} />
                </div>
                <div>
                    <label>Written proficiency:</label>
                    <input type="text" value={values.written_proficiency}
                    onChange={e => setValues({...values, written_proficiency:e.target.value})} />
                </div> <br />
                <button> Update</button>
            </form>
        </div>
    )
}

export default UpdateLanguagePage;