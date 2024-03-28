import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, useRouteLoaderData } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobDetailsDisplay from "@/components/JobDetails/JobDetails";
import Question from "@/components/QuestionsAndAnswers/Question";
import { Button } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import "@/components/styling/button.css";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label";
import { showError } from "@/components/Alert/alert";

const EmployerJobDetailsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [dataReceived, setDataReceived] = useState(false);

  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employer: "",
    job: jobId,
  });

  const [job, setJob] = useState({});
  const [questions, setQuestions] = useState([]);
  const [address, setAddress] = useState({});
  const [company, setCompany] = useState({});
  const [employers, setEmployers] = useState([]);
  const [companyEmployers, setCompanyEmployers] = useState([]);
  const [currentEmployer, setCurrentEmployer] = useState({});

  const orderEmployers = (employers) => {
    let newEmployers = employers;
    let currentUser = employers.find((employer) => employer.id === user.user_id);
    if (currentUser !== undefined) {
    let otherEmployers = employers.filter((employer) => employer.id !== user.user_id);
    newEmployers = [currentUser, ...otherEmployers];
  }
    return newEmployers;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          AxiosInstance.get(`api/jobs/${jobId}/`),
          AxiosInstance.get(`api/jobs/${jobId}/company/`),
          AxiosInstance.get(`api/jobs/${jobId}/address/`),
          AxiosInstance.get(`api/jobs/${jobId}/questions/`),
          AxiosInstance.get(`api/job/${jobId}/employers/`),
          AxiosInstance.get(`api/employers/company/${userId}/`),
        ]);

        setJob(responses[0].data);
        setCompany(responses[1].data);
        setAddress(responses[2].data);
        setQuestions(responses[3].data);
        setEmployers(orderEmployers(responses[4].data));
        setCompanyEmployers(responses[5].data);
        setDataReceived(true);

        responses[4].data.forEach((employer) => {
          if (employer.id == user.user_id) {
            setCurrentEmployer(employer);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && (error.response.status === 403 || error.response.status === 404)) {
          window.location.href = "/employer/dashboard";
        }
      }
    };

    fetchData();
  }, [jobId, userId, dataReceived]);

  const handleClick = () => {
    navigate(`/employer/job-applicants/${jobId}`);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!employers.some((employer) => employer.id == formData.employer)) {
      try {
        await AxiosInstance.post("api/employer-job-relations/create/", {
          employer: formData.employer,
          job: formData.job,
        });

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } else {
      showError("This employer has already been added.");
    }
  };

  const handleRemoveEmployer = async (id) => {
    Swal.fire({
      title: "Are you sure you want to remove this employer?",
      showCancelButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosInstance.delete(`api/employer-job-relations/delete/${jobId}/${id}/`)
          .then(() => {
            Swal.fire("Removed", "The employer has been removed successfully!", "success").then(
              () => {
                window.location.reload();
              }
            );
          })
          .catch((error) => {
            console.error("Error removing employer:", error);
            Swal.fire("Error", "There was an error removing the employer.", "error");
          });
      }
    });
  };

  const handleArchive = async () => {
    try {
      await AxiosInstance.put(`api/jobs/${jobId}/update-archive/`);
      setJob({ ...job, isArchived: !job.isArchived });
    } catch (error) {
      console.error("Error archiving job:", error);
    }
  };

  const handleLeave = async () => {
    try {
      await AxiosInstance.delete(`api/employer-job-relations/delete/${jobId}/${userId}/`);
      Swal.fire("Left", "You have left the job successfully!", "success").then(() => {
        navigate("/employer/dashboard");
      });
    } catch (error) {
      console.error("Error leaving job:", error);
      Swal.fire("Error", "There was an error leaving the job.", "error");
    }
  };

  return (
    <div>
      <div className="mb-3 flex justify-between">
        <Button className="blue-button" onClick={handleClick}>
          See Applicants
        </Button>
        <Button className="yellow-button" onClick={handleArchive}>
          {job.isArchived ? (
            <>
              <UploadOutlined /> Unarchive
            </>
          ) : (
            <>
              <DownloadOutlined /> Archive
            </>
          )}
        </Button>
      </div>
      <div className="mt-3 mb-8">
        <JobDetailsDisplay
          title={job.title}
          description={job.description}
          companyName={company.company_name}
          salary={job.salary}
          jobType={job.job_type}
          address={address}
        />
      </div>
      {questions.length > 0 && <Label className="text-2xl font-bold">Questions:</Label>}
      {questions.map((question) => (
        <ul key={question.id}>
          <Question question={question.question} />
        </ul>
      ))}
      <br />
      <div>
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 " style={{ color: "#4A5568" }}>
            Employers:
          </h4>
          <ul className="border-t border-b border-gray-300 py-4">
            {employers.map((employer) => (
              <li key={employer.id} className="flex items-center border-b py-2">
                <span className="font-">
                  {employer.first_name} {employer.last_name}
                </span>
                {employer.id !== userId &&
                  currentEmployer.is_company_admin && employers.length > 1 && (
                    <Button
                    data-testid="removeButton"
                      onClick={() => handleRemoveEmployer(employer.id)}
                      className="red-button ml-2"
                    >
                      Remove
                    </Button>
                  )}
                  {employer.id === userId && employers.length > 1 && (
                    <Button onClick={handleLeave} className="red-button ml-2">
                      Leave
                    </Button>
                  )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h5 className="text-lg font-semibold mb-2 " style={{ color: "#4A5568" }}>
            Add employers:
          </h5>
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <select
              data-testid="employerDropDown"
              name="employer"
              defaultValue={formData.employer}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option disabled value="">
                Select Employer:
              </option>

              {companyEmployers
                .filter((employer) => !employers.some((e) => e.id === employer.id))
                .map((employer) => (
                  <option value={employer.id} key={employer.id}>
                    {employer.first_name} {employer.last_name}
                  </option>
                ))}
            </select>
            <Button
              className="yellow-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobDetailsPage;
