import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import GetStartedPage from "../GetStartedPage";

describe("GetStarted component", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <GetStartedPage />
      </MemoryRouter>,
    );
    // Assert that the component renders without throwing any errors
    expect(screen.getByText(/Get started as a Job seeker or as an Employer/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Job Seeker/i)).not.toBeChecked();
    expect(screen.queryByLabelText(/Employer/i)).not.toBeChecked();
  });

  test("renders radio buttons correctly", () => {
    render(
      <MemoryRouter>
        <GetStartedPage />
      </MemoryRouter>,
    );
    // Assert that radio buttons for both options are rendered
    expect(screen.getByLabelText(/Job Seeker/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Employer/i)).toBeInTheDocument();
  });

  test("handles option change correctly", () => {
    render(
      <MemoryRouter>
        <GetStartedPage />
      </MemoryRouter>,
    );
    const optionOne = screen.getByTestId("jobseeker");
    const optionTwo = screen.getByTestId("employer");

    userEvent.click(optionOne);

    expect(screen.getByTestId("jobseeker")).toBeChecked();
    expect(screen.getByTestId("employer")).not.toBeChecked();

    userEvent.click(optionTwo);

    expect(screen.getByLabelText(/Employer/i)).toBeChecked();
    expect(screen.queryByLabelText(/Job Seeker/i)).not.toBeChecked();
  });

  test("handles form submission correctly", () => {
    const navigate = vi.fn();
    render(
      <MemoryRouter>
        <GetStartedPage />
      </MemoryRouter>,
    );
    // Mock the useNavigate hook
    vi.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(navigate);
    // Select the radio button for "Employer"
    fireEvent.click(screen.getByLabelText(/Employer/i));
    // Click the submit button
    userEvent.click(screen.getByText(/Go/i));
    // Assert that the handleSubmit function is called
    expect(navigate).toHaveBeenCalledWith("/auth/register-employer");
  });
});
