import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const JobCard = ({ title, companyName, city, country, description }) => {
  return (
    <div>
      <Card className="w-full mt-10 cursor-pointer" style={{ boxShadow: '0 0 5px #FFD700' } }>
        <CardHeader className="justify-center items-left mt-4">
          <CardTitle className="text-3xl font-bold" style={{ color: '#4A5568' }}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600 font-bold">{companyName}</div> {/* Set Company Name to grey and bold */}
          <div className="mt-4">
            <div className="justify-start items-start flex flex-row">
              <MapPin className="mr-2" />
              <span className="mr-1">{city}, </span>
              <span>{country}</span>
            </div>
          </div>
          <div className="mt-4">
            <p>{description}</p>
          </div>
          <div className="mt-4 text-gray-400">Read More</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCard;
