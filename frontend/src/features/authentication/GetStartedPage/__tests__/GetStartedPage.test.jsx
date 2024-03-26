import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import GetStartedPage from "../GetStartedPage";
import { AuthProvider } from "@/context/AuthContext";

const navigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

// vi.mock("@/components/ui/button", () => ({
//   Button: ({ children }) => <button data-testid="mock-button">{children}</button>,
// }));

describe("GetStarted component", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <GetStartedPage />
        </MemoryRouter>,
      );
    })
  })
  test("renders without crashing", () => {

    // Assert that the component renders without throwing any errors
    expect(screen.getByText(/Get started as a Job seeker or as an Employer/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Job Seeker/i)).not.toBeChecked();
    expect(screen.queryByLabelText(/Employer/i)).not.toBeChecked();
  });

  test("renders radio buttons correctly", () => {

    // Assert that radio buttons for both options are rendered
    expect(screen.getByLabelText(/Job Seeker/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Employer/i)).toBeInTheDocument();
  });

  test("handles option change correctly", () => {

    const optionOne = screen.getByTestId("job-seeker");
    const optionTwo = screen.getByTestId("employer");

    fireEvent.click(optionOne);

    expect(screen.getByTestId("job-seeker")).toBeChecked();
    expect(screen.getByTestId("employer")).not.toBeChecked();

    fireEvent.click(optionTwo);

    expect(screen.getByLabelText(/Employer/i)).toBeChecked();
    expect(screen.queryByLabelText(/Job Seeker/i)).not.toBeChecked();
  });

  test("handles form submission correctly", async () => {

    // Select the radio button for "Employer"
    fireEvent.click(screen.getByTestId("employer"));
    // Click the submit button
    const submitButton = screen.getByTestId("submit");
    await act(async () => {
      fireEvent.click(submitButton);
    })
    // Assert that the handleSubmit function is called
    expect(navigate).toHaveBeenCalledWith("/auth/join-or-create-company");
  });
});
