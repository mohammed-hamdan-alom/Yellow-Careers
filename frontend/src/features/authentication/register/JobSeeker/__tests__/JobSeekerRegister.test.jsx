import { vi, describe, it } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import JobSeekerRegister from "../JobSeekerRegister";
import AuthContext from "@/context/AuthContext";

global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("JobSeekerRegister", () => {
  const mockRegisterJobSeeker = vi.fn();

  beforeEach(() => {
    render(
      <AuthContext.Provider value={{ registerJobSeeker: mockRegisterJobSeeker }}>
        <JobSeekerRegister />
      </AuthContext.Provider>,
    );
  });

  it("should render register form", () => {
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const otherNamesInput = screen.getByLabelText("Other Names");
    const dobInput = screen.getByLabelText("Date of Birth");
    const nationalityInput = screen.getByLabelText("Nationality");
    const phoneNumberInput = screen.getByLabelText("Phone Number");
    const genderInput = screen.getByTestId("gender-input");
    const registerButton = screen.getByTestId("register-button");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(otherNamesInput).toBeInTheDocument();
    expect(dobInput).toBeInTheDocument();
    expect(nationalityInput).toBeInTheDocument();
    expect(phoneNumberInput).toBeInTheDocument();
    expect(genderInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  it("should update state when input values change", () => {
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const otherNamesInput = screen.getByLabelText("Other Names");
    const dobInput = screen.getByLabelText("Date of Birth");
    const nationalityInput = screen.getByLabelText("Nationality");
    const phoneNumberInput = screen.getByLabelText("Phone Number");
    const maleChoice = screen.getByLabelText("Male");
    const registerButton = screen.getByTestId("register-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
    fireEvent.change(firstNameInput, { target: { value: "First" } });
    fireEvent.change(lastNameInput, { target: { value: "Last" } });
    fireEvent.change(otherNamesInput, { target: { value: "Other" } });
    fireEvent.change(dobInput, { target: { value: "2000-01-01" } });
    fireEvent.change(nationalityInput, { target: { value: "British" } });
    fireEvent.change(phoneNumberInput, { target: { value: "1234567890" } });
    fireEvent.click(maleChoice);
    fireEvent.click(registerButton);

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password");
    expect(confirmPasswordInput.value).toBe("password");
    expect(firstNameInput.value).toBe("First");
    expect(lastNameInput.value).toBe("Last");
    expect(otherNamesInput.value).toBe("Other");
    expect(dobInput.value).toBe("2000-01-01");
    expect(nationalityInput.value).toBe("British");
    expect(phoneNumberInput.value).toBe("1234567890");
    expect(maleChoice.checked).toBeTruthy;
  });

  it("should call registerJobSeeker when form is submitted", () => {
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const otherNamesInput = screen.getByLabelText("Other Names");
    const dobInput = screen.getByLabelText("Date of Birth");
    const nationalityInput = screen.getByLabelText("Nationality");
    const phoneNumberInput = screen.getByLabelText("Phone Number");
    const maleChoice = screen.getByLabelText("Male");
    const registerButton = screen.getByTestId("register-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
    fireEvent.change(firstNameInput, { target: { value: "First" } });
    fireEvent.change(lastNameInput, { target: { value: "Last" } });
    fireEvent.change(otherNamesInput, { target: { value: "Other" } });
    fireEvent.change(dobInput, { target: { value: "2000-01-01" } });
    fireEvent.change(nationalityInput, { target: { value: "British" } });
    fireEvent.change(phoneNumberInput, { target: { value: "1234567890" } });
    fireEvent.click(maleChoice);
    fireEvent.click(registerButton);

    expect(mockRegisterJobSeeker).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
      password2: "password",
      firstName: "First",
      lastName: "Last",
      otherNames: "Other",
      dob: "2000-01-01",
      phoneNumber: "1234567890",
      nationality: "British",
      sex: "M",
    });
  });
});
