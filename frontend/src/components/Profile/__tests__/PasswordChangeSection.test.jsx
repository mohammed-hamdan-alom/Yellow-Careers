import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PasswordChangeSection from "../PasswordChangeSection";

describe("PasswordChangeSection component", () => {
  const mockSetOldPassword = vi.fn();
  const mockSetNewPassword = vi.fn();
  const mockSetConfirmNewPassword = vi.fn();
  const mockOnSubmit = vi.fn();

  test("renders input fields and button", () => {
    render(
      <PasswordChangeSection
        oldPassword=""
        setOldPassword={mockSetOldPassword}
        newPassword=""
        setNewPassword={mockSetNewPassword}
        confirmNewPassword=""
        setConfirmNewPassword={mockSetConfirmNewPassword}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByPlaceholderText("Old Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm New Password")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });

  test("handles input changes", () => {
    render(
      <PasswordChangeSection
        oldPassword=""
        setOldPassword={mockSetOldPassword}
        newPassword=""
        setNewPassword={mockSetNewPassword}
        confirmNewPassword=""
        setConfirmNewPassword={mockSetConfirmNewPassword}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Old Password"), {
      target: { value: "oldPassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "newPassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm New Password"), {
      target: { value: "newPassword123" },
    });

    expect(mockSetOldPassword).toHaveBeenCalledWith("oldPassword123");
    expect(mockSetNewPassword).toHaveBeenCalledWith("newPassword123");
    expect(mockSetConfirmNewPassword).toHaveBeenCalledWith("newPassword123");
  });

  test("handles form submission", () => {
    render(
      <PasswordChangeSection
        oldPassword=""
        setOldPassword={mockSetOldPassword}
        newPassword=""
        setNewPassword={mockSetNewPassword}
        confirmNewPassword=""
        setConfirmNewPassword={mockSetConfirmNewPassword}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText("Change Password"));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
