import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobDetailsDisplay from '@/components/job-details/JobDetails';
import StyledQuestion from "@/components/questions_and_answers/Question";
import { Button } from "antd";

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
        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    AxiosInstance.get(`api/jobs/${jobId}/`),
                    AxiosInstance.get(`api/jobs/${jobId}/company/`),
                    AxiosInstance.get(`api/jobs/${jobId}/address/`),
                    AxiosInstance.get(`api/jobs/${jobId}/questions/`),
                    AxiosInstance.get(`api/job/${jobId}/employers/`),
                    AxiosInstance.get(`api/employers/company/${userId}/`)
                ]);

                setJob(responses[0].data);
                setCompany(responses[1].data);
                setAddress(responses[2].data);
                setQuestions(responses[3].data);
                setEmployers(responses[4].data);
                setCompanyEmployers(responses[5].data);
                setDataReceived(true);
                //Sets current employer to logged in employer in order to receive company admin status
                responses[4].data.forEach((employer) => {
                    if (employer.id == user.user_id) {
                        setCurrentEmployer(employer)
                    }
                })
            }

            catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && (error.response.status === 403 || error.response.status === 404)) {
                    window.location.href = "/employer/dashboard";
                }
            }
        };

        fetchData();
    }, [jobId, userId, dataReceived]);

    const handleClick = () => {
        navigate(`/employer/job-applicants/${jobId}`);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await AxiosInstance.post('api/employer-job-relations/create/', {
                employer: formData.employer,
                job: formData.job
            });

            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemove = async (id) => {
        try {
            await AxiosInstance.delete(`api/employer-job-relations/delete/${jobId}/${id}/`, {
                employer: id,
                job: jobId
            });

            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="mb-3">
            <Button className="seeApplicantsButton" onClick={handleClick}>See Applicants</Button>
            </div>
            <div className="mt-3 mb-8">
                <JobDetailsDisplay title={job.title} description={job.description} companyName={company.company_name} salary={job.salary} jobType={job.job_type} address={address} />
            </div>
            {questions.length > 0 && <h4>Questions:</h4>}
            {questions.map(question => (
                <ul key={question.id}>
                    <StyledQuestion question={question.question} />
                </ul>
            ))}

            <br />

            <h4>Employers:</h4>
            {employers.map(employer => (
                <ul key={employer.id}>
                    <h5>{employer.first_name} {employer.last_name}</h5>
                    {employer.id != userId && currentEmployer.is_company_admin ? <button onClick={() => handleRemove(employer.id)}>Remove</button> : null}
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
                        employer.id !== userId && <option value={employer.id} key={employer.id}>{employer.first_name} {employer.last_name}</option>
                    ))}
                </select>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default JobDetailsEmployer;
