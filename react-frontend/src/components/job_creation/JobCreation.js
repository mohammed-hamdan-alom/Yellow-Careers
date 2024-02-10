import React, { useState } from 'react';
import './JobCreation.css';

function JobCreationForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: '',
        location: '',
        job_type: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
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
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
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
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
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