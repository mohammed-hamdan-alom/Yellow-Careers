import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import swal from "sweetalert2";

const EmployerProfile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    other_names: user?.other_names || "",
    phone_number: user?.phone_number || "",
    company: user?.company || "",
  });
  //  React automatically subscribes to context changes, so any time the value provided by the context provider changes, the components using that context will update accordingly.

  useEffect(() => {
    const fetchEmployerData = async () => {
      if (user?.user_id) {
        try {
          const response = await AxiosInstance.get(
            `/api/employers/${user?.user_id}/`
          );

          if (response.status === 200) {
            const {
              email,
              first_name,
              last_name,
              other_names,
              phone_number,
              company,
            } = response.data;
            setFormData((prevFormData) => ({
              ...prevFormData,
              email,
              first_name,
              last_name,
              other_names,
              phone_number,
              company: company || null,
            }));
          } else {
            swal.fire(
              "Failed to fetch",
              "Could not fetch employer profile.",
              "error"
            );
          }
        } catch (error) {
          console.log(error);
          swal.fire(
            "Error",
            "An error occurred while fetching the employer profile.",
            "error"
          );
        }
      }
    };

    fetchEmployerData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.user_id) {
      try {
        const response = await AxiosInstance.put(
          `/api/employers/${user?.user_id}/update/`,
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="mb-3">
        <label htmlFor="email">Email:   </label>
        <input
          type="email"
          id="email"
          name="email"
          value={user?.email}
          disabled
        />
      </div>
      <div className="mb-3">
        <label htmlFor="first_name">First Name:   </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="last_name">Last Name:   </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="other_names">Other Names:   </label>
        <input
          type="text"
          id="other_names"
          name="other_names"
          value={formData.other_names}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phone_number">Phone Number:   </label>
        <input
          type="text"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Update Profile
      </button>
    </form>
  );
};

export default EmployerProfile;
