import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'antd';
import '@/components/styling/tag.css';

const ApplicantCard = ({ application_id, firstName, lastName, status, decision }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/employer/application-details/${application_id}`);
    };

    const decisionText = decision === 'A' ? 'Accepted' :
                                             decision === 'R' ? 'Rejected' :
                                             'Undecided';

    const decisionColor = decision === 'A' ? 'green' :
                                                decision === 'R' ? 'red' :
                                                'blue';

    return (
        <div>
            <Card className="w-full mt-10 cursor-pointer hover:bg-gray-100 flex justify-between items-center" style={{ boxShadow: '0 0 5px #808080' }} onClick={handleClick}>
                <CardHeader className="justify-center items-left mt-4">
                    <div className="flex items-center">
                        <CardTitle className="text-2xl font-bold">{firstName} {lastName}</CardTitle>
                        {status === 'U' && <Tag color="purple" className="ml-2 tag-medium pulsate">New</Tag>}
                        {status === 'R' && <Tag color={decisionColor} className="ml-2 tag-medium">{decisionText}</Tag>}
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
};

const ApplicantSummary = ({ application_id, status, decision }) => {

    const [jobSeeker, setJobSeeker] = useState({});

    useEffect(() => {
        AxiosInstance.get(`api/job-seeker/application/${application_id}/`)
            .then((res) => setJobSeeker(res.data))
    }, []);

    return (
        <>
            <ApplicantCard application_id={application_id} firstName={jobSeeker.first_name} lastName={jobSeeker.last_name} status={status} decision={decision}/>
        </>
    );
};

export default ApplicantSummary;
