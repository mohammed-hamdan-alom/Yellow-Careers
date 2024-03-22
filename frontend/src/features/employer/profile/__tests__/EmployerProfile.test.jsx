import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployerProfile from "../EmployerProfile";
import { vi } from "vitest";
import AuthContext from "@/context/AuthContext";

const mockUser = {
  email: "johndoe@example.com",
  first_name: "John",
  last_name: "Doe",
  other_names: "Charles",
  phone_number: "08012345678",
  user_id: "123456789",
};

const updatedFormData = {
  email: "janedoe@example.com",
  first_name: "Updated",
  last_name: "User",
  other_names: "Other",
  phone_number: "09098765432",
};

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn((url) => {
      return Promise.resolve({ data: updatedFormData });
    }),
    put: vi.fn(() => Promise.resolve({ status: 200 })),
  },
}));

describe("EmployerProfile component", () => {
  beforeEach(() => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <EmployerProfile />
      </AuthContext.Provider>
    );
  });

  const submitForm = () => {
    fireEvent.submit(screen.getByText("Update Profile"));
  };

  const getValueFromFormData = (formData, field) => {
    const path = field.split(".");
    let value = { ...formData };
    for (const key of path) {
      value = value[key];
    }
    return value;
  };

  const assertFormValues = (formData) => {
    Object.entries(fieldMap).forEach(([label, field]) => {
      let value;
      if (label != "Email:") {
        value = getValueFromFormData(formData, field);
      }
      expect(screen.getByLabelText(label)).toHaveValue(value);
    });
  };

  const fieldMap = {
    "First Name:": "first_name",
    "Last Name:": "last_name",
    "Other Names:": "other_names",
    "Phone Number:": "phone_number",
  };

  test("fetches employer data on mount", async () => {
    assertFormValues(mockUser);
  });

  test("updates data on submit", async () => {
    Object.entries(fieldMap).forEach(([label, field]) => {
      const value = getValueFromFormData(updatedFormData, field);
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    });
    submitForm();
    await waitFor(() => {
      assertFormValues(updatedFormData);
    });
  });

  test("displays popover with invalid phone number", () => {
    const phoneNumberInput = screen.getByLabelText("Phone Number:");
    fireEvent.change(phoneNumberInput, { target: { value: "123" } });
    submitForm();
    expect(screen.getByText("Please match the format requested.")).toBeInTheDocument();
  });

});
