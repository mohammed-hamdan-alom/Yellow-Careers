import './JobCreation.css';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AxiosInstance from '../../Axios';
import { Axios } from 'axios';

function JobCreationForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: 0,
        address: '',
        job_type: 'FT'
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        AxiosInstance.post('api/jobs/create-job', {
            title: formData.title,
            description: formData.description,
            salary: formData.salary,
            address: formData.address,
            job_type: formData.job_type
        }).then((response) => {
            console.log(response);
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
    }

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
                        value={formData.address.post_code}
                        onChange={handleChange}

                    />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.address.city}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.address.country}
                        onChange={handleChange}

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