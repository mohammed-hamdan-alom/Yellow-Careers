import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import AxiosInstance from '../../../Axios';
import { Axios } from 'axios';


function EmployerDashBoardPage() {
  const { user } = useContext(AuthContext)
  const userId = user.user_id
  const [EmployerJobs, setEmployerJobs] = useState([])
  const [companyJobs, setCompanyJobs] = useState([])

  useEffect(() => {
    Promise.all([
      AxiosInstance.get(`api/employer/${userId}/jobs/`),
      AxiosInstance.get(`api/employer/${userId}/company-jobs/`)
    ]).then((responses) => {
      setEmployerJobs(responses[0].data)
      setCompanyJobs(responses[1].data)
    }).catch((error) => console.error('Error fetching data:', error))
  }
    , [userId])


  return (
    <div>EmployerDashBoardPage</div>
  )
}

export default EmployerDashBoardPage