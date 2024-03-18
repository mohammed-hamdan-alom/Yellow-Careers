import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobSearchBar from "../../search/JobSearchBar";


const JobListPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [jobs, setJobs] = useState(undefined);
    const [resume, setResume] = useState({});
    const [isJobRetrieved, setIsJobRetrieved] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            AxiosInstance.get(`api/job-seeker/${userId}/resume/`)
            .then((response) => {
                setResume(response.data)
                if (response.data.id !== undefined) {
                    AxiosInstance.get(`api/job-seeker/${userId}/matched-jobs/`)
                        .then((res) => {
                            setJobs(res.data)
                            setIsJobRetrieved(true);
                        }).catch((error) => console.error('Error fetching data:', error));
                }
            });
        };
        fetchData();
    }, [isJobRetrieved]);
    

    return (
        <div>
            <h1>Matched jobs</h1>
            <br></br>
            {resume.id && jobs ? <JobSearchBar database={jobs} /> :
                <h1>Error loading the jobs, please create a resume. If you have already done so, reload the page</h1>
            }

        </div >
    )
};

export default JobListPage;

//main

// import React, { useContext, useState, useEffect } from "react";
// import AuthContext from "@/context/AuthContext";
// import AxiosInstance from "@/utils/AxiosInstance";
// import JobSearchBar from "../../../../components/search/JobSearchBar";
// import { Label } from "@/components/ui/label";

// const JobListPage = () => {
//   const { user } = useContext(AuthContext);
//   const userId = user.user_id;

//   const [jobs, setJobs] = useState(undefined);
//   const [resume, setResume] = useState({});
//   const [jobRetrieved, setJobRetrieved] = useState(false);

//   useEffect(() => {
//     AxiosInstance.get(`api/job-seeker/${userId}/resume/`).then((response) => {
//       setResume(response.data);
//       if (response.data.id !== undefined) {
//         AxiosInstance.get(`api/job-seeker/${userId}/matched-jobs/`)
//           .then((res) => {
//             setJobs(res.data);
//             setJobRetrieved(true);
//           })
//           .catch((error) => console.error("Error fetching data:", error));
//       }
//     });
//   }, [jobRetrieved]);

//   return (
//     <div className="flex flex-col justify-center">
//       {resume.id && jobs ? (
//         <JobSearchBar database={jobs} />
//       ) : (
//         <h1>Create a resume first</h1>
//       )}
//     </div>
//   );
// };

// export default JobListPage;