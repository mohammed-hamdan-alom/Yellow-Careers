import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    other_names: '',
    phone_number: '',
    dob: '',
    nationality: '',
    sex: '',
    city: '',
    post_code: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        other_names: user.other_names || '',
        phone_number: user.phone_number,
        dob: user.dob || '',
        nationality: user.nationality || '',
        sex: user.sex || '',
        city: user.address?.city || '',
        post_code: user.address?.post_code || '',
        country: user.address?.country || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
        <div className="mb-3">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={user?.email} disabled />
      </div>
      <div className="mb-3">
        <label htmlFor="first_name">First Name</label>
        <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="last_name">Last Name</label>
        <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="other_names">Other Names</label>
        <input type="text" id="other_names" name="other_names" value={formData.other_names} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="phone_number">Phone Number</label>
        <input type="text" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="dob">Date of Birth</label>
        <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="nationality">Nationality</label>
        <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="sex">Sex</label>
        <select id="sex" name="sex" value={formData.sex} onChange={handleChange}>
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="city">City</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="post_code">Post Code</label>
        <input type="text" id="post_code" name="post_code" value={formData.post_code} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="country">Country</label>
        <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary">Update Profile</button>
    </form>
  );
}

export default EditProfile;
