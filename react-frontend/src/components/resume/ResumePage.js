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
  const [softSkills, setSoftSkills] = useState([]);
  const [softSkill, setSoftSkill] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [technicalSkill, setTechnicalSkill] = useState([]);
  const [languages, setLanguages] = useState([]);
  const[language, setLanguage] = useState({
    language: '',
    spoken_proficiency: '',
    written_proficiency: '',
  });

  const [errors, setErrors] = useState({
    github: '',
    linkedin: '',
    about: '',
    experience: '',
    softSkill: '',
    techSkill: ''
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

  // Fetch the user's resume details
  useEffect(() => {
    if (resumeId === null) {
      return;
    }
    // Fetch the current resume details 
    fetch(`http://localhost:8000/api/resumes/${resumeId}/update/`)
      .then(response => response.json())
      .then(data => setResume(data));

    // Fetch the current resume's soft skills
    fetch(`http://localhost:8000/api/resumes/${resumeId}/soft-skills/`)
    .then(response => response.json())
    .then(data => setSoftSkills(data.map(item => item.skill)))
    // .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    // Fetch the current resume's technical skills
    fetch(`http://localhost:8000/api/resumes/${resumeId}/technical-skills/`)
    .then(response => response.json())
    .then(data => setTechnicalSkills(data.map(item=>item.skill)))
    .catch(error=>console.error('Error:', error));

    //Fetch the current resume's languages
    fetch(`http://localhost:8000/api/resumes/${resumeId}/languages/`)
    .then(response => response.json())
    .then(data => setLanguages(data))
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }, [resumeId]);


  // Handle changes in the forms
  const handleResumeChange = (event) => {
    setResume({
      ...resume,
      [event.target.name]: event.target.value
    });
  };

  const handleSoftSkillChange = (event) => {
    setSoftSkill(event.target.value);
  };

  const handleTechnicalSkillChange = (event) => {
    setTechnicalSkill(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage({
      ...language,
      [event.target.name]: event.target.value
    }
    )};

  // PUT request when form submitted
  const handleSubmitResume = (event) => {
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

const handleSubmitSoftSkills = (event) => {
  event.preventDefault();
  AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/soft-skills/create/`, {
      skill:softSkill
  }).then((response) => {
      console.log('Success: ',response);
      swal.fire({
        title: "Soft Skill Added",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
    });
    setSoftSkill('');
    setErrors({
      softSkill: '',
    });

    setSoftSkills(prevSoftSkills => [...prevSoftSkills, softSkill]);

  }).catch((error) => {
      console.error('Error:', error);
      let errorMessages = '';
      if (error.response && error.response.data) {
        // Parse the error response
        // TODO: Doesnt show error properly
        errorMessages = Object.values(error.response.data).join(' ');
        setErrors(error.response.data);};
      swal.fire({
        title: "Creating Soft Skill Failed",
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
    });
  });

};


const handleSubmitTechnicalSkills = (event) => {
  event.preventDefault();
  AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/technical-skills/create/`, {
      skill:technicalSkill
  }).then((response) => {
      console.log('Success: ',response);
      swal.fire({
        title: "Technical Skill Added",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
    });
    setTechnicalSkill('');
    setErrors({
      technicalSkill: '',
    });

    setTechnicalSkills(prevTechnicalSkills => [...prevTechnicalSkills, technicalSkill]);

  }).catch((error) => {
      console.error('Error:', error);
      let errorMessages = '';
      if (error.response && error.response.data) {
        // Parse the error response
        // TODO: Doesnt show error properly
        errorMessages = Object.values(error.response.data).join(' ');
        setErrors(error.response.data);};
      swal.fire({
        title: "Creating Technical Skill Failed",
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
    });
  });

};


const handleSubmitLanguages = (event) => {
  event.preventDefault();
  AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/languages/create/`, {
      language:language.language,
      spoken_proficiency:language.spoken_proficiency,
      written_proficiency:language.written_proficiency
  }).then((response) => {
      console.log('Success: ',response);
      swal.fire({
        title: "Language Added",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
    });
    setLanguage({
      language: '',
      spoken_proficiency : '',
      written_proficiency : ''
    });
    setErrors({
      language: '',
      spoken_proficiency : '',
      written_proficiency : ''
    });
    

    setLanguages(prevLanguages => [...prevLanguages, language]);

  }).catch((error) => {
      console.error('Error:', error);
      let errorMessages = '';
      if (error.response && error.response.data) {
        // Parse the error response
        // TODO: Doesnt show error properly
        errorMessages = Object.values(error.response.data).join(' ');
        setErrors(error.response.data);};
      swal.fire({
        title: "Creating Langauge Failed",
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
  <div>
    <h2>Resume info</h2>
    <form onSubmit={handleSubmitResume}>
      <div>
        <label>
          GitHub:
          <input type="text" name="github" value={resume.github} onChange={handleResumeChange} />
          {errors.github && <p>{errors.github}</p>}
        </label>
      </div>
      <div>
        <label>
          LinkedIn:
          <input type="text" name="linkedin" value={resume.linkedin} onChange={handleResumeChange} />
          {errors.linkedin && <p>{errors.linkedin}</p>}
        </label>
      </div>
      <div>
        <label>
          About:
          <textarea name="about" value={resume.about} onChange={handleResumeChange} />
          {errors.about && <p>{errors.about}</p>}
        </label>
      </div>
      <div>
        <label>
          Experience:
          <textarea name="experience" value={resume.experience} onChange={handleResumeChange} />
          {errors.experience && <p>{errors.experience}</p>}
        </label>
      </div>
      <button type="submit">Update Resume</button>
    </form>

    <h2>Soft Skills</h2>
    <ul>
    {softSkills.map((skill, index) => (
      <li key={index}>{skill}</li>
    ))}
    </ul>
    <form onSubmit={handleSubmitSoftSkills}>
      <div>
        <label>
          Soft Skill:
          <input type="text" name="softSkill" value={softSkill} onChange={handleSoftSkillChange} />
          {errors.softSkill && <p>{errors.softSkill}</p>}
        </label>
      </div>
      <button type="submit">Add Soft Skill</button>
    </form>

    <h2>Technical Skills</h2>
    <ul>
    {technicalSkills.map((skill, index) => (
      <li key={index}>{skill}</li>
    ))}
    </ul>
    <form onSubmit={handleSubmitTechnicalSkills}>
      <div>
        <label>
          Technical Skill:
          <input type="text" name="technicalSkill" value={technicalSkill} onChange={handleTechnicalSkillChange} />
          {errors.technicalSkill && <p>{errors.technicalSkill}</p>}
        </label>
      </div>
      <button type="submit">Add Technical Skill</button>
    </form>

    <h2>Languages</h2>
    <ul>
    {languages.map((language, index) => (
      <li key={index}>
        <p>Language: {language.language}</p>
        <p>Spoken proficiency: {language.spoken_proficiency}</p>
        <p>Written proficiency: {language.written_proficiency}</p>
      </li>
    ))}
    </ul>
    <form onSubmit={handleSubmitLanguages}>
      <div>
        <label>
          Language:
          <input type="text" name="language" value={language.language} onChange={handleLanguageChange} />
          {errors.language && <p>{errors.language}</p>}
        </label>
      </div>
      <div>
        <label>
          Spoken Proficiency:
          <select name="spoken_proficiency" value={language.spoken_proficiency} onChange={handleLanguageChange}>
          <option value="">Select Proficiency</option>
          <option value="B">Basic</option>
          <option value="I">Intermediate</option>
          <option value="A">Advanced</option>
          <option value="F">Fluent</option>
          </select>
          {errors.spoken_proficiency && <p>{errors.spoken_proficiency}</p>}
        </label>
      </div>
      <div>
        <label>
        Written Proficiency:
          <select name="written_proficiency" value={language.written_proficiency} onChange={handleLanguageChange}>
          <option value="">Select Proficiency</option>
          <option value="B">Basic</option>
          <option value="I">Intermediate</option>
          <option value="A">Advanced</option>
          <option value="F">Fluent</option>
          </select>
          {errors.written_proficiency && <p>{errors.written_proficiency}</p>}
        </label>
      </div>
      <button type="submit">Add Language</button>
    </form>


      </div>
    );
}

export default UpdateResumePage;