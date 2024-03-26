import { vi, describe, it } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import AuthContext from "@/context/AuthContext";
import LoginPage from "../LoginPage";

describe("LoginPage", () => {
  const mockLoginUser = vi.fn();

  beforeEach(() => {
    render(
      <AuthContext.Provider value={{ loginUser: mockLoginUser }}>
        <LoginPage />
      </AuthContext.Provider>,
    );
  });

  it("should render login form", () => {
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByTestId("login-button");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("should update state when input values change", () => {
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password");
  });

  it("should call loginUser when form is submitted", () => {
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    expect(mockLoginUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });
});
