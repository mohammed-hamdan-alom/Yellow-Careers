import './JobCreation.css';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import AxiosInstance from "@/utils/AxiosInstance";

function JobCreationForm() {

    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: 0,
        address: null,
        job_type: 'FT'
    });

    const [addressData, setAddressData] = useState({
        city: '',
        post_code: '',
        country: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        AxiosInstance.post('api/jobs/create-job', {
            title: formData.title,
            description: formData.description,
            salary: formData.salary,
            address: addressData,
            job_type: formData.job_type
        }).then((response) => {
            AxiosInstance.post('api/employer-job-relations/create/', {
                employer: userId,
                job: response.data.id
            });
            navigate(`/employer/job-details/${response.data.id}`);
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddressData({
            ...addressData,
            [name]: value
        });
    };

    return (
        <div className="job-creation-form">
            <form onSubmit={handleSubmit} className="job-creation-form">
                <h2>Job Creation</h2>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="salary">Salary</label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="post_code">Postcode</label>
                    <input
                        type="text"
                        name="post_code"
                        value={addressData.post_code}
                        onChange={handleAddressChange}

                    />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        name="city"
                        value={addressData.city}
                        onChange={handleAddressChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={addressData.country}
                        onChange={handleAddressChange}

                    />
                </div>
                <div className="form-group">
                    <label htmlFor="job_type">Job Type</label>
                    <select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                    >
                        <option value="FT">Full Time</option>
                        <option value="PT">Part Time</option>
                        <option value="IN">Internship</option>
                        <option value="TM">Temporary</option>
                    </select>
                </div>
                <div className='form-actions'>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default JobCreationForm;





//from main//


// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthContext from "@/context/AuthContext";
// import AxiosInstance from "@/utils/AxiosInstance";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input, InputNumber } from "antd";
// import { Select } from "antd";
// import { Button } from "@/components/ui/button";
// const { TextArea } = Input;

// function JobCreationForm() {
//   const { user } = useContext(AuthContext);
//   const userId = user.user_id;

//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     salary: 0,
//     address: null,
//     job_type: "FT",
//   });

//   const [addressData, setAddressData] = useState({
//     city: "",
//     post_code: "",
//     country: "",
//   });

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (addressData.city && addressData.country && addressData.post_code) {
//       AxiosInstance.post("api/addresses/create/", {
//         city: addressData.city,
//         country: addressData.country,
//         post_code: addressData.post_code,
//       }).then((response) => {
//         setFormData({
//           ...formData,
//           ["address"]: response.data.id,
//         });
//       });
//     }
//     AxiosInstance.post("api/jobs/create-job", {
//       title: formData.title,
//       description: formData.description,
//       salary: formData.salary,
//       address: formData.address,
//       job_type: formData.job_type,
//     })
//       .then((response) => {
//         AxiosInstance.post("api/employer-job-relations/create/", {
//           employer: userId,
//           job: response.data.id,
//         });
//         //navigate(`/job-seeker/job-details/${job.id}`);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleAddressChange = (event) => {
//     const { name, value } = event.target;
//     setAddressData({
//       ...addressData,
//       [name]: value,
//     });
//   };

//   return (
//     <div className="w-full flex justify-center items-center">
//       <Card className="w-1/2 px-12 py-6">
//         <CardHeader className="justify-center items-center mt-4">
//           <CardTitle>Create a Job Listing</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col mb-4">
//               <Label className="text-2xl">Job Title</Label>
//               <Input
//                 className="w-full mt-2"
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="flex flex-col mb-4">
//               <Label className="text-2xl">Job Description</Label>
//               <TextArea
//                 className="w-full mt-2"
//                 type="text"
//                 rows={4}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="flex flex-col mb-4">
//               <Label className="text-2xl">Salary</Label>
//               <InputNumber
//                 className="w-full mt-2"
//                 formatter={(value) =>
//                   `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\£\s?|(,*)/g, "")}
//                 defaultValue={formData.salary}
//                 onChange={(value) =>
//                   setFormData({ ...formData, salary: value })
//                 }
//               />
//             </div>
//             <div className="flex flex-row justify-between mb-4 space-x-4">
//               <div className="flex flex-col mb-4 ">
//                 <Label className="text-2xl">Postcode</Label>
//                 <Input
//                   className="w-full mt-2"
//                   type="text"
//                   name="post_code"
//                   value={addressData.post_code}
//                   onChange={handleAddressChange}
//                 />
//               </div>
//               <div className="flex flex-col mb-4">
//                 <Label className="text-2xl">City</Label>
//                 <Input
//                   className="w-full mt-2"
//                   type="text"
//                   name="city"
//                   value={addressData.city}
//                   onChange={handleAddressChange}
//                 />
//               </div>
//               <div className="flex flex-col mb-4">
//                 <Label className="text-2xl">Country</Label>
//                 <Input
//                   className="w-full mt-2"
//                   type="text"
//                   name="country"
//                   value={addressData.country}
//                   onChange={handleAddressChange}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col mb-4">
//               <Label className="text-2xl">Job Type</Label>
//               <Select
//                 className="w-full mt-2"
//                 name="job_type"
//                 value={formData.job_type}
//                 onChange={(value) => setFormData({ ...formData, job_type: value })}
//               >
//                 <Select.Option value="FT">Full Time</Select.Option>
//                 <Select.Option value="PT">Part Time</Select.Option>
//                 <Select.Option value="IN">Internship</Select.Option>
//                 <Select.Option value="TM">Temporary</Select.Option>
//               </Select>
//             </div>
//             <div className="mt-12 w-full">
//               <Button type="submit" className="w-full" variant="outline" >
//                 Create Job
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default JobCreationForm;