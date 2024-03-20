import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AuthContext from "@/context/AuthContext";
import EmployerProfile from "../EmployerProfile";


describe("EmployerProfile component", () => {
  test("fetches employer data on mount", async () => {
    // Define mock user data
    const mockUser = {
      email: "employer@example.com",
      first_name: "Jane",
      last_name: "Doe",
      other_names: "Mohammed",
      phone_number: "08012345679",
    };

    // Render the component wrapped with AuthContext.Provider
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <EmployerProfile />
      </AuthContext.Provider>
    );

    // Assert that the form fields are prefilled with the correct values
    expect(screen.getByLabelText(/Email/)).toHaveValue("employer@example.com");
    expect(screen.getByLabelText(/First Name/)).toHaveValue("Jane");
    expect(screen.getByLabelText(/Last Name/)).toHaveValue("Doe");
    expect(screen.getByLabelText(/Other Names/)).toHaveValue("Mohammed");
    expect(screen.getByLabelText(/Phone Number/)).toHaveValue("08012345679");
  });
});
