import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dot } from 'lucide-react';
import '@/components/styling/tag.css';

const ApplicantCard = ({ application_id, firstName, lastName, status, decision }) => {
    const navigate = useNavigate();


    const handleClick = () => {
        navigate(`/employer/application-details/${application_id}`);
    };

    return (
        <div>
          <Card className="w-full mt-10 cursor-pointer hover:bg-gray-100 flex justify-between items-center" style={{ boxShadow: '0 0 5px #808080' }} onClick={handleClick}>
            <CardHeader className="justify-center items-left mt-4">
              <CardTitle className="text-2xl font-bold">{firstName} {lastName}</CardTitle>
            </CardHeader>
            {status === 'U' && <Dot color="blue" size={50} className="mr-4 pulsate" />}
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
