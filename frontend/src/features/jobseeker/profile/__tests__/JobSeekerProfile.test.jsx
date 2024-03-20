import React from "react";
import { render, screen } from "@testing-library/react";
import JobSeekerProfile from "../JobSeekerProfile";
import { vi } from "vitest";
import AuthContext from "@/context/AuthContext";


describe("JobSeekerProfile component", () => {
  test("fetches job seeker data on mount", async () => {
    // Define mock user data
    const mockUser = {
      email: "johndoe@example.com",
      first_name: "John",
      last_name: "Doe",
      other_names: "Charles",
      phone_number: "08012345678",
      dob: "1999-01-01",
      nationality: "British",
      sex: "M",
      address: {
        city: "London",
        post_code: "L9K 1AA",
        country: "United Kingdom",
      },
    };

    // Render the component wrapped with AuthContext.Provider
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <JobSeekerProfile />
      </AuthContext.Provider>
    );

    // Assert that the form fields are prefilled with the correct values
    expect(screen.getByLabelText(/Email/)).toHaveValue("johndoe@example.com");
    expect(screen.getByLabelText(/First Name/)).toHaveValue("John");
    expect(screen.getByLabelText(/Last Name/)).toHaveValue("Doe");
    expect(screen.getByLabelText(/Other Names/)).toHaveValue("Charles");
    expect(screen.getByLabelText(/Phone Number/)).toHaveValue("08012345678");
    expect(screen.getByLabelText(/Date of Birth/)).toHaveValue("1999-01-01");
    expect(screen.getByLabelText(/Nationality/)).toHaveValue("British");
    expect(screen.getByLabelText(/Sex/)).toHaveValue("M");
    expect(screen.getByLabelText(/City/)).toHaveValue("London");
    expect(screen.getByLabelText(/Post Code/)).toHaveValue("L9K 1AA");
    expect(screen.getByLabelText(/Country/)).toHaveValue("United Kingdom");
  });
});
