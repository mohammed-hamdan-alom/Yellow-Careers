import React from 'react';
import { Label } from '@/components/ui/label';
import { MapPin, HandCoins } from 'lucide-react';

const JobDetailsDisplay = ({ title, description, companyName, companyLink, salary, jobType, address }) => {
  return (
    <div>
      <Label className="text-3xl font-bold" style={{ color: '#4A5568' }}>{title}</Label>
      <p className="text-lg mb-4 mt-3">{description}</p>
      <a href={companyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        <Label className="text-xl font-semibold mb-2 cursor-pointer">{companyName}</Label>
      </a>
      <div className="flex flex-wrap mb-4">
        <div className="w-full md:w-1/2 flex items-center mb-2">
          <HandCoins className="mr-2 text-gray-700" size={20} />
          <Label className="text-gray-700">Salary: {salary}</Label>
        </div>
        <div className="w-full md:w-1/2 flex items-center">
          <MapPin className="mr-2 text-gray-700" size={20} />
          <Label className="text-gray-700"><strong>Location:</strong> {address.post_code}, {address.city}, {address.country}</Label>
        </div>
      </div>
      <Label className="text-gray-700">Job Type: {jobType}</Label>
    </div>
  );
};

export default JobDetailsDisplay;
