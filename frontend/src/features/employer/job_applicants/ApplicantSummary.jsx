import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { Card, Button } from "antd";

const ApplicantSummary = ({ id }) => {
    const navigate = useNavigate();
    const [jobSeeker, setJobSeeker] = useState({});

    useEffect(() => {
        
        AxiosInstance.get(`api/job-seeker/application/${id}/`)
            .then((res) => setJobSeeker(res.data))
    }, []);

    const handleShowApplication = (key) => {
        navigate(`/employer/application-details/${key}`);
    }

    return (
        <>
            <Card title={jobSeeker.first_name + " " + jobSeeker.last_name} >
                <Button onClick={() => handleShowApplication(id)}> Show Application </Button>
            </Card >
        </>
    );
};

export default ApplicantSummary;
