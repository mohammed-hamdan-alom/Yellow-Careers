import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, HandCoins, Briefcase } from 'lucide-react';
import { Tag } from 'antd';
import '@/components/styling/tag.css';

const JobCard = ({ title, companyName, city, country, description, salary, jobType }) => {
  return (
    <div>
      <Card className="w-full mt-10 cursor-pointer" style={{ boxShadow: '0 0 5px #808080' }}>
        <CardHeader className="justify-center items-left mt-4">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold" style={{ color: '#4A5568' }}>{companyName}</div> {/* Set Company Name to grey and bold */}
          <div className="flex mt-4">
            <Tag style={{ display: 'flex', alignItems: 'center' }} color='green'>
              <MapPin className="mr-2 text-gray-700" color='green' size={15} />
              <span>Location: {city}, {country}</span>
            </Tag>
            <Tag style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }} color='blue'>
              <HandCoins className="mr-2" size={15} />
              <span>Salary: £{salary}</span>
            </Tag>
            <Tag style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }} color='purple'>
              <Briefcase className="mr-2" size={15} /> Job Type: {jobType}
            </Tag>
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