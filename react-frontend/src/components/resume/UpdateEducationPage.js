import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { showError, showSuccess } from './notificationUtils';


function UpdateEducationPage() {
    const{id} = useParams();
    const [values, setValues] = useState({
        id:id,
        start_date : '',
        end_date : '',
        level:'',
        institution:'',
        grade:'',
        address:{
            city:'',
            post_code:'',
            country:''
        }
    })
    const location = useLocation()
    const resumeId = location.state.resumeId
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/resumes/${resumeId}/educations/update/${id}`)
        .then(res => {
            console.log(res.data.address.city)
            setValues({
                ...values, start_date:res.data.start_date,
                end_date:res.data.end_date,
                level:res.data.level,
                institution:res.data.institution,
                grade:res.data.grade,
                address:{
                    ...values.address,
                    city:res.data.address.city,
                    post_code:res.data.address.post_code,
                    country:res.data.address.country
                }
                
            })
        })
        .catch(err => console.log(err))
    }, [])

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://127.0.0.1:8000/api/resumes/${resumeId}/educations/update/${id}`, values)
        .then(res =>{
            navigate(-1);
            showSuccess("Education Updated")

        })
        .catch(err => console.log(err))
        showError('Updating Education Failed');
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Start Date</label>
                    <input type="date" value={values.start_date} onChange={e => setValues({...values, start_date:e.target.value})}/>
                </div>
                <div>
                    <label>End Date</label>
                    <input type="date" value={values.end_date} onChange={e => setValues({...values, end_date:e.target.value})}/>
                </div>
                <div>
                    <label>level:</label>
                    <select name="level" value={values.level} onChange={e => setValues({...values, level:e.target.value})}>
                        <option value="">Select Level</option>
                        <option value="HS">High School</option>
                        <option value="BA">Bachelors</option>
                        <option value="MA">Masters</option>
                        <option value="PHD">Doctorate</option>
                    </select>
                </div>
                <div>
                    <label>institution</label>
                    <input type="text" value={values.institution} onChange={e => setValues({...values, institution:e.target.value})}/>
                </div>
                <div>
                    <label>grade</label>
                    <input type="text" value={values.grade} onChange={e => setValues({...values, grade:e.target.value})}/>
                </div>
                {values.address && ( 
                        <>
                        <div>
                            <label>city</label>
                            <input type="text" value={values.address.city} onChange={e => setValues(prevState => ({ ...prevState, address: { ...prevState.address, city: e.target.value } }))} />
                        </div>
                        <div>
                            <label>post code</label>
                            <input type="text" value={values.address.post_code} onChange={e => setValues(prevState => ({ ...prevState, address: { ...prevState.address, post_code: e.target.value } }))} />
                        </div>
                        <div>
                            <label>country</label>
                            <input type="text" value={values.address.country} onChange={e => setValues(prevState => ({ ...prevState, address: { ...prevState.address, country: e.target.value } }))} />
                        </div>
                        </>
                    )}
                 <br />
                <button> Update</button>
            </form>
        </div>
    )
}

export default UpdateEducationPage;