import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '@/context/AuthContext';
import AxiosInstance from "@/utils/AxiosInstance";
import swal from 'sweetalert2'

const JobSeekerProfile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    other_names: user?.other_names || "",
    phone_number: user?.phone_number || "",
    dob: user?.dob || "",
    nationality: user?.nationality || "",
    sex: user?.sex || "",
    address: {
      city: user?.address?.city || "",
      post_code: user?.address?.post_code || "",
      country: user?.address?.country || "",
    },
  });

  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [isValidDOB, setIsValidDOB] = useState(true);

  useEffect(() => {
    const fetchJobSeekerData = async () => {
      if (user?.user_id) {
        try {
          const response = await AxiosInstance.get(`/api/job-seekers/${user?.user_id}/`);
          if (response.status === 200) {
            const { email, first_name, last_name, other_names, phone_number, dob, nationality, sex, address } = response.data;
            setFormData({
              email,
              first_name,
              last_name,
              other_names,
              phone_number,
              dob,
              nationality,
              sex,
              address: {
                city: address?.city || '',
                post_code: address?.post_code || '',
                country: address?.country || '',
              },
            });
          } else {
            swal.fire("Failed to fetch", "Could not fetch job seeker profile.", "error");
          }
        } catch (error) {
          swal.fire("Error", "An error occurred while fetching the profile.", "error");
        }
      }
    };

    fetchJobSeekerData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['city', 'post_code', 'country'].includes(name)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: value,
        },
      }));
    } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.user_id) {
      const phoneNumberInput = document.getElementById("phone_number");
      if (phoneNumberInput.checkValidity()) {
        setIsValidPhoneNumber(true); // Update phone number validity state

        // Check if the date of birth is not in the future
        const currentDate = new Date();
        const selectedDate = new Date(formData.dob);
        if (selectedDate > currentDate) {
          setIsValidDOB(false);
          return;
        } else {
          setIsValidDOB(true);
        }

        try {
          const response = await AxiosInstance.put(
            `/api/job-seekers/${user?.user_id}/update/`,
            formData
          );

          if (response.status === 200) {
            swal.fire(
              "Profile Updated",
              "Your profile has been updated successfully.",
              "success"
            );
          } else {
            swal.fire("Update Failed", `Error: ${response.status}`, "error");
          }
        } catch (error) {
          swal.fire("Update Failed", error.message, "error");
        }
      } else {
        setIsValidPhoneNumber(false);
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="mb-3">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user?.email}
          disabled
        />
      </div>
      <div className="mb-3">
        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          maxLength={50}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          maxLength={50}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="other_names">Other Names</label>
        <input
          type="text"
          id="other_names"
          name="other_names"
          value={formData.other_names}
          onChange={handleChange}
          maxLength={50}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phone_number">Phone Number</label>
        <input
          type="text"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          pattern="[0-9]{9,15}"
          required
        />
        <span className="text-danger">
          {formData.phone_number !== "" &&
            !isValidPhoneNumber &&
            "Please match the format requested."}
        </span>
      </div>
      <div className="mb-3">
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
        <span className="text-danger">
          {formData.dob !== "" &&
            !isValidDOB &&
            "Date of birth cannot be in the future."}
        </span>
      </div>
      <div className="mb-3">
        <label htmlFor="nationality">Nationality</label>
        <input
          type="text"
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="sex">Sex</label>
        <select
          id="sex"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.address.city}
          onChange={handleChange}
          pattern="^[a-zA-Z\s]*$"
          maxLength={50}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="post_code">Post Code</label>
        <input
          type="text"
          id="post_code"
          name="post_code"
          value={formData.address.post_code}
          onChange={handleChange}
          pattern="^[a-zA-Z0-9\s]*$"
          maxLength={50}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.address.country}
          onChange={handleChange}
          pattern="^[a-zA-Z\s]*$"
          maxLength={50}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Update Profile
      </button>
    </form>
  );
}

export default JobSeekerProfile;
