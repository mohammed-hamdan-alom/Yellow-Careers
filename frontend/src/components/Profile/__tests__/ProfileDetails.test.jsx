import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileDetails from "../ProfileDetails";

describe("ProfileDetails component", () => {
  const formData = {
    email: "johndoe@example.com",
    first_name: "John",
    last_name: "Doe",
    other_names: "Charles",
    phone_number: "08012345678",
    dob: "1999-01-01",
    nationality: "British",
    sex: "Male",
    address: {
      city: "London",
      post_code: "L9K 1AA",
      country: "United Kingdom",
    },
  };
  const handleChange = vi.fn();
  const handleSubmit = vi.fn();
  test("renders common fields", () => {
    render(
      <ProfileDetails
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        userType="employer"
      />,
    );
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("First Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Other Names:")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number:")).toBeInTheDocument();
  });
  test("renders job seeker fields when userType is 'job-seeker'", () => {
    render(<ProfileDetails formData={formData} userType="job-seeker" />);

    // Assert that job seeker specific fields are rendered
    expect(screen.getByLabelText("Date of Birth:")).toBeInTheDocument();
    expect(screen.getByLabelText("Nationality:")).toBeInTheDocument();
    expect(screen.getByLabelText("Sex:")).toBeInTheDocument();

    // Assert that non-job seeker specific fields are not rendered
    expect(screen.queryByLabelText("Some Other Field:")).not.toBeInTheDocument();
  });
  test("renders employer specific fields when userType is 'employer'", () => {
    const mockUser = {
      email: "johndoe@example.com",
      first_name: "John",
      last_name: "Doe",
      other_names: "Charles",
      phone_number: "08012345678",
      user_id: "123456789",
    };

    render(
      <ProfileDetails
        formData={mockUser}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        userType="employer"
      />,
    );
    expect(screen.queryByLabelText("Date of Birth:")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Nationality:")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Sex:")).not.toBeInTheDocument();
  });
});
