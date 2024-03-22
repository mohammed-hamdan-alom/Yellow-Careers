import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import '@/components/styling/tag.css';

const ApplicantCard = ({ id, firstName, lastName }) => {
    const navigate = useNavigate();


    const handleClick = () => {
        navigate(`/employer/application-details/${id}`);
    };

    return (
        <div>
            <Card className="w-full mt-10 cursor-pointer hover:bg-gray-100" style={{ boxShadow: '0 0 5px #808080' }} onClick={handleClick}>
                <CardHeader className="justify-center items-left mt-4">
                    <CardTitle className="text-3xl font-bold">{firstName} {lastName}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
};

const ApplicantSummary = ({ id }) => {

    const [jobSeeker, setJobSeeker] = useState({});

    useEffect(() => {
        AxiosInstance.get(`api/job-seeker/application/${id}/`)
            .then((res) => setJobSeeker(res.data))
    }, []);

    return (
        <>
            <ApplicantCard id={id} firstName={jobSeeker.first_name} lastName={jobSeeker.last_name} />
        </>
    );
};

export default ApplicantSummary;
