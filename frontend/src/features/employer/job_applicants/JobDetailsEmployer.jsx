import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";



const JobDetailsEmployer = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;
    const [dataReceived, setDataReceived] = useState(false);

    const { jobId } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employer: '',
        job: jobId
    });

    const [job, setJob] = useState({});
    const [questions, setQuestions] = useState([]);
    const [address, setAddress] = useState({});
    const [company, setCompany] = useState({});
    const [employers, setEmployers] = useState([]);
    const [companyEmployers, setCompanyEmployers] = useState([]);
    const [currentEmployer, setCurrentEmployer] = useState({});

    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/${jobId}/`),
            AxiosInstance.get(`api/jobs/${jobId}/company/`),
            AxiosInstance.get(`api/jobs/${jobId}/address/`),
            AxiosInstance.get(`api/jobs/${jobId}/questions/`),
            AxiosInstance.get(`api/job/${jobId}/employers/`),
            AxiosInstance.get(`api/employers/company/${userId}/`)
        ]).then((responses) => {
            setJob(responses[0].data);
            setCompany(responses[1].data);
            setAddress(responses[2].data);
            setQuestions(responses[3].data);
            setEmployers(responses[4].data);
            setCompanyEmployers(responses[5].data);
            setDataReceived(true);
        }).catch((error) => console.error('Error fetching data:', error));

        //Sets current employer to logged in employer in order to receive company admin status
        employers.forEach((employer) => {
            if (employer.id == user.user_id) {
                setCurrentEmployer(employer)
            }
        })
    }, [jobId, userId, dataReceived]);

    const handleClick = () => {
        navigate(`/employer/job-applicants/${jobId}`);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        AxiosInstance.post('api/employer-job-relations/create/', {
            employer: formData.employer,
            job: formData.job
        }).then((response) => {
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleRemoveEmployer = (id) => {
        AxiosInstance.delete(`api/employer-job-relations/delete/${jobId}/${id}/`, {
            employer: id,
            job: jobId
        }).then((response) => {
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        })
    }

    return (

        // ANY EMPLOYER (even if not from company) CAN VIEW THIS
        <div>
            <button onClick={handleClick}>See Applicants</button>
            <h1>{job.title}</h1>
            <h2>{job.description}</h2>
            <h3>{company.company_name}</h3>
            <h4>Salary: {job.salary}</h4>
            <h4>Job Type: {job.job_type}</h4>
            <h4><strong>Location:</strong> {address.post_code}, {address.city}, {address.country}</h4>
            {questions.length === 0 ? null : <h4>Questions:</h4>}
            <ul>
                {questions.map(question => (
                    <>
                        <li key={question.id}>{question.question}</li>
                    </>
                ))}
            </ul>
            <br></br>

            <h4>Employers:</h4>
            {employers.map(employer => (
                < ul key={employer.id} >
                    <h5>{employer.first_name} {employer.last_name}</h5>
                    {employer.id != userId && currentEmployer.is_company_admin ? <button onClick={() => handleRemoveEmployer(employer.id)}>Remove</button> : null}
                </ul>
            ))}

            <h5>Add employers:</h5>
            <form onSubmit={handleSubmit}>
                <select
                    name="employer"
                    value={formData.employer}
                    onChange={handleChange}
                >
                    {companyEmployers.map(employer => (
                        employer.id != userId ? <option value={employer.id} key={employer.id} > {employer.first_name} {employer.last_name}</option> : null
                    ))}
                </select>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div >
    )
};

export default JobDetailsEmployer;