import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MapPin } from "lucide-react";

const JobCard = ({title, companyName, city, country, description}) => {
  return (
    <div>
      <Card className="w-full mt-10">
        <CardHeader className="justify-center items-left mt-4">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <div>{name}</div>
            <div className="justify-start items-start flex flex-row">
              <MapPin className="mr-2"/>
              <span className="mr-1">{city}, </span>
              <span>{country}</span>
            </div>
            <div className="mt-4">
              {companyName}
            </div>
          </div>
          <div className="mt-4">
            <p>{description}</p>
          </div>
          <div className="mt-4 text-gray-400 cursor-pointer">
            Read More 
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default JobCard
