import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { showError, showSuccess } from './notificationUtils';


function UpdateProfessionalExperiencePage() {
    const{id} = useParams();
    const [values, setValues] = useState({
        id:id,
        start_date:'',
        end_date:'',
        company:'',
        position:'',
        description:'',
        address:{
            city:'',
            post_code:'',
            country:''
        }
    })
    const location = useLocation()
    const resumeId = location.state.resumeId

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/resumes/${resumeId}/professional-experiences/update/${id}`)
        .then(res => {
            console.log(res.data.address.city)
            setValues({
                ...values, start_date:res.data.start_date,
                end_date:res.data.end_date,
                company:res.data.company,
                position:res.data.position,
                description:res.data.description,
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
        axios.put(`http://127.0.0.1:8000/api/resumes/${resumeId}/professional-experiences/update/${id}`, values)
        .then(res =>{
            navigate(-1);
            showSuccess('Professional Experience Updated');
        })
        .catch(err => console.log(err))
        showError('Updating Professional Experience Failed');
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
                    <label>company</label>
                    <input type="text" value={values.level} onChange={e => setValues({...values, company:e.target.value})}/>
                </div>
                <div>
                    <label>position</label>
                    <input type="text" value={values.position} onChange={e => setValues({...values, position:e.target.value})}/>
                </div>
                <div>
                    <label>description</label>
                    <input type="text" value={values.description} onChange={e => setValues({...values, description:e.target.value})}/>
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

export default UpdateProfessionalExperiencePage;