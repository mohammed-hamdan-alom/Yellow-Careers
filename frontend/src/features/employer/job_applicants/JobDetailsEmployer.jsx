import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobDetailsDisplay from '@/components/job-details/JobDetails';
import StyledQuestion from "@/components/questions_and_answers/Question";
import { Button, Space } from "antd";
import '@/components/styling/button.css';
import { GlobalOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';


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
            } catch (error) {
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

    const handleRemoveEmployer = async (id) => {
        Swal.fire({
            title: 'Are you sure you want to remove this employer?',
            showCancelButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                AxiosInstance.delete(`api/employer-job-relations/delete/${jobId}/${id}/`)
                    .then(() => {
                        Swal.fire(
                            'Removed',
                            'The employer has been removed successfully!',
                            'success'
                        ).then(() => {
                            window.location.reload();
                        });
                    })
                    .catch((error) => {
                        console.error('Error removing employer:', error);
                        Swal.fire(
                            'Error',
                            'There was an error removing the employer.',
                            'error'
                        )
                    });
            }
        });
    }

    return (
        <div>
            <div className="mb-3">
                <Button className="seeApplicantsButton" onClick={handleClick}>See Applicants</Button>
            </div>
            <div className="mt-3 mb-8">
                <JobDetailsDisplay title={job.title} description={job.description} companyName={company.company_name} salary={job.salary} jobType={job.job_type} address={address} />
            </div>
            {questions.length > 0 && <h5 className="text-lg font-semibold mb-2">Questions:</h5>
}
            {questions.map(question => (
                <ul key={question.id}>
                    <StyledQuestion question={question.question} />
                </ul>
            ))}

            <br />

            <div>
                <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Employers:</h4>
                    <ul className="space-y-2">
                        {employers.map(employer => (
                            <li key={employer.id} className="flex items-center border-b py-2">
                                <span className="font-medium">{employer.first_name} {employer.last_name}</span>
                                {employer.id !== userId && currentEmployer.is_company_admin &&
                                    <Button onClick={() => handleRemoveEmployer(employer.id)} className="redButton ml-2">Remove</Button>
                                }
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <h5 className="text-lg font-semibold mb-2">Add employers:</h5>
                    <form onSubmit={handleSubmit} className="flex items-center">
                        <select
                            name="employer"
                            value={formData.employer}
                            onChange={handleChange}
                            className="mr-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {companyEmployers.map(employer => (
                                employer.id !== userId && <option value={employer.id} key={employer.id}>{employer.first_name} {employer.last_name}</option>
                            ))}
                        </select>
                        <Button className="yellowButton" type="submit" onClick={handleSubmit}>Submit</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsEmployer;