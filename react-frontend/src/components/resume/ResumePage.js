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

  const [errors, setErrors] = useState({
    github: '',
    linkedin: '',
    about: '',
    experience: '',
  });


  
// Decode token to get user information
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

  // Fetch user's resume id
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
  console.log('resume',resumeId);

  // Fetch tthe user's resume details
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

  // PUT request when form submitted
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


      setErrors({
        github: '',
        linkedin: '',
        about: '',
        experience: '',
      });

    }).catch((error) => {
        console.error('Error:', error);
        let errorMessages = '';
        if (error.response && error.response.data) {
          // Parse the error response
          errorMessages = Object.values(error.response.data).join(' ');
          setErrors(error.response.data);};
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
        {errors.github && <p>{errors.github}</p>}
      </label>
    </div>
    <div>
      <label>
        LinkedIn:
        <input type="text" name="linkedin" value={resume.linkedin} onChange={handleChange} />
        {errors.linkedin && <p>{errors.linkedin}</p>}
      </label>
    </div>
    <div>
      <label>
        About:
        <textarea name="about" value={resume.about} onChange={handleChange} />
        {errors.about && <p>{errors.about}</p>}
      </label>
    </div>
    <div>
      <label>
        Experience:
        <textarea name="experience" value={resume.experience} onChange={handleChange} />
        {errors.experience && <p>{errors.experience}</p>}
      </label>
    </div>
    <button type="submit">Update Resume</button>
  </form>
);
}

export default UpdateResumePage;