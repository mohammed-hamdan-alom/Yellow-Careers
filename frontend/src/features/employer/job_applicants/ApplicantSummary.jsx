import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";

const ApplicantSummary = ({ id }) => {
    const navigate = useNavigate();
    const [jobSeeker, setJobSeeker] = useState({});

    useEffect(() => {
        AxiosInstance.get(`api/job-seekers/${id}/`)
            .then((res) => setJobSeeker(res.data))
    }, []);

    return (
        <div>
            <h3>{jobSeeker.first_name} {jobSeeker.last_name}</h3>
        </div>
    );
};

export default ApplicantSummary;
