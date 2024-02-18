import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';
import {jwtDecode} from 'jwt-decode';


function UpdateResumePage() {
  const [resume, setResume] = useState({
    github: '',
    linkedin: '',
    about: '',
    experience: '',
  });

  // let token = localStorage.getItem("authTokens")?.access;
  // let decodedToken;

  // if (token) {
  //   decodedToken = jwtDecode(token);
  //   console.log(decodedToken);
  // }
  // else{
  //   console.log("No token found");
  // }

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

  useEffect(() => {
    // Fetch the current resume details when the component mounts
    fetch('http://localhost:8000/api/resumes/5/update/')
      .then(response => response.json())
      .then(data => setResume(data));
  }, []);

  const handleChange = (event) => {
    setResume({
      ...resume,
      [event.target.name]: event.target.value
    });
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   fetch('http://localhost:8000/api/resumes/5/update/', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(resume),
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('Success:', data);
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //     console.log(resume);
  //   });
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    AxiosInstance.put('http://localhost:8000/api/resumes/5/update/', {
        github: resume.github,
        linked: resume.linkedin,
        about: resume.about,
        experience: resume.experience,
    }).then((response) => {
        console.log('Success: ',response);
    }).catch((error) => {
        console.error('Error:', error);
    });
};

  return (
    <form onSubmit={handleSubmit}>
      <label>
        GitHub:
        <input type="text" name="github" value={resume.github} onChange={handleChange} />
      </label>
      <label>
        LinkedIn:
        <input type="text" name="linkedin" value={resume.linkedin} onChange={handleChange} />
      </label>
      <label>
        About:
        <textarea name="about" value={resume.about} onChange={handleChange} />
      </label>
      <label>
        Experience:
        <textarea name="experience" value={resume.experience} onChange={handleChange} />
      </label>
      <button type="submit">Update Resume</button>
    </form>
  );
}

export default UpdateResumePage;