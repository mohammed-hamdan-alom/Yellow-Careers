import React, { useContext, useEffect } from "react";
import AuthContext, { AuthProvider } from "../AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/Alert";

import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';

vi.mock("jwtDecode");

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
  },
}));


vi.mock("@/components/Alert/Alert", () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

const navigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

// let localStorageMock = {};
// vi.spyOn(global, "localStorage", "get").mockImplementation((key, value) => {
//   localStorageMock[key] = value;
// });

describe("AuthProvider", () => {

  beforeEach(() => {
    // Object.keys(localStorageMock).forEach((key) => { delete localStorageMock[key]; 
    // });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    });
    vi.clearAllMocks();
  });

  it("should handle loginUser success", async () => {
    AxiosInstance.post.mockResolvedValueOnce({
      status: 200,
      data: { access: "access-token", refresh: "refresh-token" },
    });

    const TestComponent = () => {
      const { loginUser, authTokens } = useContext(AuthContext);
      return (
        <>
          <button
            data-testid="login-button"
            onClick={() => loginUser({ email: "test@example.com", password: "password" })}
            />
          <div data-testid="auth-tokens">{JSON.stringify(authTokens)}</div>
        </>
      );
    };

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(getByTestId("login-button"));

    await waitFor(() => {
      expect(getByTestId("auth-tokens").textContent).to.equal('{"access":"access-token","refresh":"refresh-token"}');
    });
  });

  it("should handle loginUser error", async () => {
    AxiosInstance.post.mockRejectedValueOnce(new Error());
  
    const TestComponent = () => {
      const { loginUser, authTokens } = useContext(AuthContext);
      return (
        <>
          <button
            data-testid="login-button"
            onClick={() => loginUser({ email: "test@example.com", password: "password" })}
            />
          <div data-testid="auth-tokens">{JSON.stringify(authTokens)}</div>
        </>
      );
    };
  
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  
    fireEvent.click(getByTestId("login-button"));
  
    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith("Username or Password does not exist");
      expect(getByTestId("auth-tokens").textContent).to.equal("null");
    });
  });
  
  it("should handle registerJobSeeker", async () => {
    AxiosInstance.post.mockResolvedValueOnce({ status: 201 });
  
    const TestComponent = () => {
      const { registerJobSeeker } = useContext(AuthContext);
      return (
        <button
          data-testid="register-button"
          onClick={() => registerJobSeeker({
            email: "test@test.com",
            password: "password",
            password2: "password",
            firstName: "First",
            lastName: "Last",
            otherNames: "Other",
            dob: "2000-01-01",
            phoneNumber: "1234567890",
            nationality: "Nationality",
            sex: "Sex",
          })}
        />
      );
    };
  
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  
    fireEvent.click(getByTestId("register-button"));
  
    await waitFor(() => {
      expect(showSuccess).toHaveBeenCalledWith("Registration Successful, Login Now");
      expect(navigate).toHaveBeenCalledWith("/auth/login");
    });
  });
  
  it("should handle registerEmployer", async () => {
    AxiosInstance.post.mockResolvedValueOnce({ status: 201 });
  
    const TestComponent = () => {
      const { registerEmployer } = useContext(AuthContext);
      return (
        <button
          data-testid="register-employer-button"
          onClick={() => registerEmployer("test@test.com", "password", "password", "Company")}
        />
      );
    };
  
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  
    fireEvent.click(getByTestId("register-employer-button"));
  
    await waitFor(() => {
      expect(showSuccess).toHaveBeenCalledWith("Registration Successful, Login Now");
      expect(navigate).toHaveBeenCalledWith("/auth/login");
    });
  });
  
  it("should handle updateToken", async () => {
    AxiosInstance.post.mockResolvedValueOnce({
      status: 200,
      data: { 
        access: "access-token",
        refresh: "refresh-token"
      },
    });
  
    const TestComponent = () => {
      const { updateToken, authTokens } = useContext(AuthContext);
      useEffect(() => {
        updateToken();
      }, []);
      return (
        <div data-testid="auth-tokens">{JSON.stringify(authTokens)}</div>
      );
    };
  
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  
    await waitFor(() => {
      // expect(getByTestId("auth-tokens").textContent).to.equal(JSON.stringify({ access: "access-token", refresh: "refresh-token" }));
    });
  });
  
  it("should handle logoutUser", () => {
    const TestComponent = () => {
      const { logoutUser, user, authTokens } = useContext(AuthContext);
      return (
        <>
          <button
            data-testid="logout-button"
            onClick={() => logoutUser()}
            >
            Logout
          </button>
          <div data-testid="token">{JSON.stringify(authTokens)}</div>
        </>
      );
    };
  
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  
    fireEvent.click(getByTestId("logout-button"));
    
    expect(localStorage.removeItem).toHaveBeenCalledWith("authTokens");
    expect(navigate).toHaveBeenCalledWith("/");
    expect(getByTestId('token').textContent).to.equal('null');
    expect(showSuccess).toHaveBeenCalledWith("Logout Successful");
  });
  
});
