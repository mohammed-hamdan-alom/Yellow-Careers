import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';
import {jwtDecode} from 'jwt-decode';
import swal from 'sweetalert2'



function UpdateResumePage() {
  const [resume, setResume] = useState({
    github: '',
    linkedin: '',
    about: '',
    experience: '',
  });

  const [resumeId, setResumeId] = useState(null);

  let authTokens = localStorage.getItem("authTokens");
  let token;
  let decodedToken;

  if (authTokens) {
    token = JSON.parse(authTokens).access;
    if (token) {
      decodedToken = jwtDecode(token);
      console.log(decodedToken);
    } else {
      console.log("No access token found");
    }
  } else {
    console.log("No authTokens found");
  }

  let userId = decodedToken.user_id;

  useEffect(() => {
    async function fetchResumeId() {
      const response = await fetch(`http://localhost:8000/api/job-seekers/${userId}/`);
      const data = await response.json();
      if (data.resume === null) {
        console.log("No resume or jobseeker found");
      }
      return data.resume;
    }

    fetchResumeId().then(id => {
      setResumeId(id);
    });
  }, [userId]);
  
  // resumeId = fetchResumeId();
  console.log('resume',resumeId);

  useEffect(() => {
    if (resumeId === null) {
      return;
    }
    // Fetch the current resume details when the component mounts
    fetch(`http://localhost:8000/api/resumes/${resumeId}/update/`)
      .then(response => response.json())
      .then(data => setResume(data));
  }, [resumeId]);

  const handleChange = (event) => {
    setResume({
      ...resume,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    AxiosInstance.put(`http://localhost:8000/api/resumes/${resumeId}/update/`, {
        github: resume.github,
        linked: resume.linkedin,
        about: resume.about,
        experience: resume.experience,
    }).then((response) => {
        console.log('Success: ',response);
        swal.fire({
          title: "Update Successful",
          icon: "success",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
      });

    }).catch((error) => {
        console.error('Error:', error);
        swal.fire({
          title: "Update Failed",
          icon: "error",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
      });
    });

};

return (
  <form onSubmit={handleSubmit}>
    <div>
      <label>
        GitHub:
        <input type="text" name="github" value={resume.github} onChange={handleChange} />
      </label>
    </div>
    <div>
      <label>
        LinkedIn:
        <input type="text" name="linkedin" value={resume.linkedin} onChange={handleChange} />
      </label>
    </div>
    <div>
      <label>
        About:
        <textarea name="about" value={resume.about} onChange={handleChange} />
      </label>
    </div>
    <div>
      <label>
        Experience:
        <textarea name="experience" value={resume.experience} onChange={handleChange} />
      </label>
    </div>
    <button type="submit">Update Resume</button>
  </form>
);
}

export default UpdateResumePage;