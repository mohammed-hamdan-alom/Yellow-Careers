import React from 'react';
import { Label } from '@/components/ui/label';
import { MapPin, HandCoins, Briefcase } from 'lucide-react';
import { Tag } from 'antd';

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
      <div className="flex mb-2">
        <Label className="text-xl font-semibold" style={{ color: '#4A5568' }}>{companyName}</Label>
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="w-auto flex items-center">
          <Tag className="tag-large flex items-center" color='green'>
            <MapPin className="mr-2 text-gray-700" size={20} />
            <span>Location: {address.post_code}, {address.city}, {address.country}</span>
          </Tag>
        </div>
        <div className="w-auto flex items-center">
          <Tag className="tag-large flex items-center" color='blue'>
            <HandCoins className="mr-2" size={20} />
            <span>Salary: £{salary}</span>
          </Tag>
        </div>
        <div className="w-auto flex items-center">
          <Tag className="tag-large flex items-center" color='purple'>
            <Briefcase className="mr-2" size={20} /> Job Type: {jobType}
          </Tag>
        </div>
      </div>
      <Label className="text-lg mb-10 mt-2">{formattedDescription}</Label>
    </div>
  );
};

export default JobDetailsDisplay;