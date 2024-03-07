import './JobCreation.css';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import AxiosInstance from "@/utils/AxiosInstance";

function JobCreationForm() {

    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: 0,
        address: null,
        job_type: 'FT'
    });

    const [addressData, setAddressData] = useState({
        city: '',
        post_code: '',
        country: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (addressData.city && addressData.country && addressData.post_code) {
            AxiosInstance.post('api/addresses/create/', {
                city: addressData.city,
                country: addressData.country,
                post_code: addressData.post_code
            }).then((response) => {
                setFormData({
                    ...formData,
                    ['address']: response.data.id
                })
            });
        }
        AxiosInstance.post('api/jobs/create-job', {
            title: formData.title,
            description: formData.description,
            salary: formData.salary,
            address: formData.address,
            job_type: formData.job_type
        }).then((response) => {
            AxiosInstance.post('api/employer-job-relations/create/', {
                employer: userId,
                job: response.data.id
            });
            //navigate(`/job-seeker/job-details/${job.id}`);
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddressData({
            ...addressData,
            [name]: value
        });
    };

    return (
        <div className="job-creation-form">
            <form onSubmit={handleSubmit} className="job-creation-form">
                <h2>Job Creation</h2>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="salary">Salary</label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="post_code">Postcode</label>
                    <input
                        type="text"
                        name="post_code"
                        value={addressData.post_code}
                        onChange={handleAddressChange}

                    />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        name="city"
                        value={addressData.city}
                        onChange={handleAddressChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={addressData.country}
                        onChange={handleAddressChange}

                    />
                </div>
                <div className="form-group">
                    <label htmlFor="job_type">Job Type</label>
                    <select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                    >
                        <option value="FT">Full Time</option>
                        <option value="PT">Part Time</option>
                        <option value="IN">Internship</option>
                        <option value="TM">Temporary</option>
                    </select>
                </div>
                <div className='form-actions'>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default JobCreationForm;