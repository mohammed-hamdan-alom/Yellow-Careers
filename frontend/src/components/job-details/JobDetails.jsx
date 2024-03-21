import React from 'react';
import { Label } from '@/components/ui/label';
import { MapPin, HandCoins, Briefcase } from 'lucide-react';
import { Tag } from 'antd';
import '@/components/styling/tag.css';

const JobDetailsDisplay = ({ title, description, companyName, salary, jobType, address }) => {

  const formattedDescription = description ? description.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  )) : '';

  return (
    <div>
      <Label className="text-3xl font-bold">{title}</Label>
      <div className="flex mb-1">
        <Label className="text-xl font-semibold" style={{ color: '#4A5568' }}>{companyName}</Label>
      </div>
      <div className="flex flex-wrap mb-2">
        <div className="w-auto flex items-center mr-2">
          <Tag className="tag-medium flex items-center" color='green'>
            <MapPin className="mr-2 text-gray-700" color='green' size={20} />
            <span>Location: {address.post_code}, {address.city}, {address.country}</span>
          </Tag>
        </div>
        <div className="w-auto flex items-center mr-2">
          <Tag className="tag-medium flex items-center" color='blue'>
            <HandCoins className="mr-2" size={20} />
            <span>Salary: £{salary}</span>
          </Tag>
        </div>
        <div className="w-auto flex items-center">
          <Tag className="tag-medium flex items-center" color='purple'>
            <Briefcase className="mr-2" size={20} /> Job Type: {jobType}
          </Tag>
        </div>
      </div>
      <Label className="text-lg mb-10 mt-2">{formattedDescription}</Label>
    </div>
  );
};

export default JobDetailsDisplay;

