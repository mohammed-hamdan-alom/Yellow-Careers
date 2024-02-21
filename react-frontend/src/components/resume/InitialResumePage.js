import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';
import {jwtDecode} from 'jwt-decode';
import swal from 'sweetalert2';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Axios } from 'axios';



function UpdateResumePage2() {

  const showError = (message) => {
    swal.fire({
      title: message,
      icon: "error",
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
  });
  }

  const showSuccess = (message) => {
    swal.fire({
      title: message,
      icon: "success",
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
  });
  }


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
  const [educations, setEducations] = useState([])
  const [education, setEducation] = useState({
    start_date : '',
    end_date : '',
    level:'',
    institution:'',
    grade:'',
    address:{
      city:'',
      post_code:'',
      country:''
    }
  })
  const [professionalExperiences, setProfessionalExperiences] = useState([])
  const [professionalExperience, setProfessionalExperience] = useState({
    start_date:'',
    end_date:'',
    company:'',
    position:'',
    description:'',
    address:{
      city:'',
      post_code:'',
      country:''
    }
  })

  const [errors, setErrors] = useState({
    github: '',
    linkedin: '',
    about: '',
    experience: '',
    softSkill: '',
    techSkill: '',
    education:''
  });
  
// Decode token to get user information
  
  const {user} = useContext(AuthContext);
  const userId = user.user_id;

  console.log('user',userId);

  // Fetch user's resume id
  useEffect(() => {
    async function fetchResumeId() {
      const response = await AxiosInstance.get(`http://localhost:8000/api/job-seekers/${userId}/`);
      const data = await response.data;
      if (response.status === 404){
        console.log("Jobseeker not found");
      }
      if (data.resume === null) {
        console.log("Resume not found");
        // TODO : Create a new resume
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

    AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/update/`)
      .then((response) => {setResume(response.data)})
      .then((response) => console.log(response))
      .catch((error) => console.error('Error:', error));

    // // Fetch the current resume details 
    // fetch(`http://localhost:8000/api/resumes/${resumeId}/update/`)
    //   .then(response => response.json())
    //   .then(data => setResume(data));

    AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/soft-skills/`)
      .then((response) => {setSoftSkills(response.data.map(item => item.skill))})
      .then((response) => console.log(response))
      .catch((error) => console.error('Error:', error));

    // // Fetch the current resume's soft skills
    // fetch(`http://localhost:8000/api/resumes/${resumeId}/soft-skills/`)
    // .then(response => response.json())
    // .then(data => setSoftSkills(data.map(item => item.skill)))
    // // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));

    AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/technical-skills/`)
      .then((response) => {setTechnicalSkills(response.data.map(item => item.skill))})
      .then((response) => console.log(response))
      .catch((error) => console.error('Error:', error));

    // // Fetch the current resume's technical skills
    // fetch(`http://localhost:8000/api/resumes/${resumeId}/technical-skills/`)
    // .then(response => response.json())
    // .then(data => setTechnicalSkills(data.map(item=>item.skill)))
    // .catch(error=>console.error('Error:', error));

    AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/languages/`)
      .then((response) => {setLanguages(response.data)})
      .then((response) => console.log(response))
      .catch((error) => console.error('Error:', error));

    // //Fetch the current resume's languages
    // fetch(`http://localhost:8000/api/resumes/${resumeId}/languages/`)
    // .then(response => response.json())
    // .then(data => setLanguages(data))
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));

    AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/educations/`)
      .then((response) => {setEducations(response.data)})
      .then((response) => console.log(response))
      .catch((error) => console.error('Error:', error));

    // //Fetch the current resume's educations
    // fetch(`http://localhost:8000/api/resumes/${resumeId}/educations/`)
    // .then(response => response.json())
    // .then(data => setEducations(data))
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));

    AxiosInstance.get(`http://localhost:8000/api/resumes/${resumeId}/professional-experiences/`)
      .then((response) => {setProfessionalExperiences(response.data)})
      .then((response) => console.log(response))
      .catch((error) => console.error('Error:', error));

    // //Fetch the current resume's professional experiences
    // fetch(`http://localhost:8000/api/resumes/${resumeId}/professional-experiences/`)
    // .then(response => response.json())
    // .then(data => setProfessionalExperiences(data))
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));

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

  const handleEducationChange = (event) => {
    setEducation({
      ...education,
      [event.target.name]: event.target.value
    }
    )};

  const handleProfessionalExperienceChange = (event) => {
    const { name, value } = event.target;
    if (name.includes("address")) {
      const addressField = name.split(".")[1]; // Extract the address field name
      setProfessionalExperience({
        ...professionalExperience,
        address: {
          ...professionalExperience.address,
          [addressField]: value,
        },
      });
    } else {
      setProfessionalExperience({
        ...professionalExperience,
        [name]: value,
      });
    }
  };
  

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
        showSuccess('Resume Updated');

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
        showError('Updating Resume Failed');
    });

};

const handleSubmitSoftSkills = (event) => {
  event.preventDefault();
  AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/soft-skills/create/`, {
      skill:softSkill
  }).then((response) => {
      console.log('Success: ',response);
      showSuccess('Soft Skill Added');
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
      showError('Creating Soft Skill Failed');
  });

};


const handleSubmitTechnicalSkills = (event) => {
  event.preventDefault();
  AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/technical-skills/create/`, {
      skill:technicalSkill
  }).then((response) => {
      console.log('Success: ',response);
      showSuccess('Technical Skill Added');
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
      showError('Creating Technical Skill Failed');
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
      showSuccess('Language Added');
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
      showError('Creating Language Failed');
  });

};


const handleSubmitProfessionalExperiences = (event) => {
  event.preventDefault();
  AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/professional-experiences/create/`, {
      start_date:professionalExperience.start_date,
      end_date : professionalExperience.end_date,
      company: professionalExperience.company,
      description: professionalExperience.description,
      address:{
        city:professionalExperience.address.city,
        post_code:professionalExperience.address.post_code,
        country:professionalExperience.address.country
      }
  }).then((response) => {
      console.log('Success: ',response);
      showSuccess('Professional Experience Added');
    setProfessionalExperience({
      start_date : '',
      end_date : '',
      company:'',
      position:'',
      address:{
        city:'',
        post_code:'',
        country:''
      }
    });
    setErrors({
      start_date : '',
      end_date : '',
      company:'',
      position:'',
      address:{
        city:'',
        post_code:'',
        country:''
      }
    });

    setProfessionalExperiences(prevProfessionalExperiences => [...prevProfessionalExperiences, professionalExperience]);

    
  }).catch((error) => {
      console.error('Error:', error);
      let errorMessages = '';
      if (error.response && error.response.data) {
        // Parse the error response
        // TODO: Doesnt show error properly
        errorMessages = Object.values(error.response.data).join(' ');
        setErrors(error.response.data);};
      showError('Creating Professional Experience Failed');
  });

};

const handleSubmitEducations = (event) => {
  event.preventDefault();
  AxiosInstance.post(`http://localhost:8000/api/resumes/${resumeId}/educations/create/`, {
      start_date:education.start_date,
      end_date : education.end_date,
      level: education.level,
      institution: education.institution,
      grade: education.grade,
      address:{
        city:education.address.city,
        post_code:education.address.post_code,
        country:education.address.country
      }
  }).then((response) => {
      console.log('Success: ',response);
      showSuccess('Education Added');
    setEducation({
      start_date : '',
      end_date : '',
      level:'',
      institution:'',
      grade:'',
      address:{
        city:'',
        post_code:'',
        country:''
      }
    });
    setErrors({
      start_date : '',
      end_date : '',
      level:'',
      institution:'',
      grade:'',
      address:{
        city:'',
        post_code:'',
        country:''
      }
    });

    setEducations(prevEducations => [...prevEducations, education]);

    
  }).catch((error) => {
      console.error('Error:', error);
      let errorMessages = '';
      if (error.response && error.response.data) {
        // Parse the error response
        // TODO: Doesnt show error properly
        errorMessages = Object.values(error.response.data).join(' ');
        setErrors(error.response.data);};
      showError('Creating Education Failed');
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

    <h2>Education</h2>
    <ul>
    {educations.map((education, index) => (
      <li key={index}>
        <p>start date: {education.start_date}</p>
        <p>end:date :  {education.end_date}</p>
        <p>level: {education.level}</p>
        <p>institution :  {education.institution}</p>
        <p>grade: {education.grade}</p>
        {education.address && ( 
            <>
              <p>City: {education.address.city}</p>
              <p>Post Code: {education.address.post_code}</p>
              <p>Country: {education.address.country}</p>
            </>
          )}
      </li>
    ))}
    </ul>

    <form onSubmit={handleSubmitEducations}>
      <div>
        <label>
          start date:
          <input type="date" name="start-date" defaultValue={education.start_date} onChange={handleEducationChange} />
          {errors.education && <p>{errors.education}</p>}
        </label>
        <label>
          end date:
          <input type="date" name="end-date" defaultValue={education.end_date} onChange={handleEducationChange} />
          {errors.education && <p>{errors.education}</p>}
        </label>
      </div>
      <div>
        <label>
          level:
          <select name="level" value={education.level} onChange={handleEducationChange}>
          <option value="">Select level</option>
          <option value="HS">High School</option>
          <option value="BA">Bachelors</option>
          <option value="MA">Masters</option>
          <option value="PHD">Doctorate</option>
          </select>
          {errors.education && <p>{errors.education}</p>}
        </label>
      </div>
      <label>
          institution:
          <input type="text" name="institution" value={education.institution} onChange={handleEducationChange} />
          {errors.education && <p>{errors.education}</p>}
        </label>
        <label>
          grade:
          <input type="text" name="grade" value={education.grade} onChange={handleEducationChange} />
          {errors.education && <p>{errors.education}</p>}
        </label>

          <h3>ADDRESS</h3>
        <label>
          city:
          <input type="text" name="city" defaultValue={education.address.city} onChange={handleEducationChange} />
          {errors.education && <p>{errors.education}</p>}
        </label>

        <label>
          post code:
          <input type="text" name="post-code" defaultValue={education.address.post_code} onChange={handleEducationChange} />
          {errors.education && <p>{errors.education}</p>}
        </label>

        <label>
          country:
          <input type="text" name="country" defaultValue={education.address.country} onChange={handleEducationChange} />
          {errors.education && <p>{errors.education}</p>}
        </label>
      
      <button type="submit">Add Education</button>
    </form>

    <h2>Professional Experience</h2>
    <ul>
    {professionalExperiences.map((professionalExperience, index) => (
      <li key={index}>
        <p>start date: {professionalExperience.start_date}</p>
        <p>end:date :  {professionalExperience.end_date}</p>
        <p>company: {professionalExperience.company}</p>
        <p>position :  {professionalExperience.position}</p>
        {professionalExperience.address && ( 
            <>
              <p>City: {professionalExperience.address.city}</p>
              <p>Post Code: {professionalExperience.address.post_code}</p>
              <p>Country: {professionalExperience.address.country}</p>
            </>
          )}
      </li>
    ))}
    </ul>

    <form onSubmit={handleSubmitProfessionalExperiences}>
      <div>
        <label>
          start date:
          <input type="date" name="start_date" value={professionalExperience.start_date} onChange={handleProfessionalExperienceChange} />
          {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
        </label>
        <label>
          end date:
          <input type="date" name="end-date" value={professionalExperience.end_date} onChange={handleProfessionalExperienceChange} />
          {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
        </label>
      </div>
      <label>
          company:
          <input type="text" name="company" value={professionalExperience.company} onChange={handleProfessionalExperienceChange} />
          {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
        </label>
        <label>
          position:
          <input type="text" name="position" value={professionalExperience.position} onChange={handleProfessionalExperienceChange} />
          {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
        </label>
        <label>
          description:
          <input type="text" name="description" value={professionalExperience.description} onChange={handleProfessionalExperienceChange} />
          {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
        </label>

          <h3>ADDRESS</h3>
        <label>
          city:
          <input type="text" name="city" value={professionalExperience.address.city} onChange={handleProfessionalExperienceChange} />
          {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
        </label>

        <label>
          post code:
          <input type="text" name="post_code" value={professionalExperience.address.post_code} onChange={handleProfessionalExperienceChange} />
          {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
        </label>

        <label>
          country:
          <input type="text" name="country" value={professionalExperience.address.country} onChange={handleProfessionalExperienceChange} />
          {errors.professionalExperience && <p>{errors.professionalExperience}</p>}
        </label>
      
      <button type="submit">Add professional experience</button>
    </form>
    



      </div>
    );
}

export default UpdateResumePage;