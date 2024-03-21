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

  const assertFormValues = (formData) => {
    Object.entries(formData).forEach(([field, value]) => {
      const label = fieldToLabelMap[field];
      if (label) {
        expect(screen.getByLabelText(label)).toHaveValue(value);
      }
    });
    expect(screen.getByLabelText(/Email/i)).toHaveValue(mockUser.email);
  };

  const fieldToLabelMap = {
    first_name: "First Name",
    last_name: "Last Name",
    other_names: "Other Names",
    phone_number: "Phone Number",
  };

  test("fetches employer data on mount", async () => {
    assertFormValues(mockUser);
  });

  test("updates data on submit", async () => {
    const fieldsToUpdate = {
      first_name: updatedFormData.first_name,
      last_name: updatedFormData.last_name,
      other_names: updatedFormData.other_names,
      phone_number: updatedFormData.phone_number,
    };

    Object.entries(fieldsToUpdate).forEach(([field, value]) => {
      fireEvent.change(screen.getByLabelText(fieldToLabelMap[field]), {
        target: { value },
      });
    });

    submitForm();

    await waitFor(() => {
      assertFormValues(updatedFormData);
    });
  });

  test("displays popover with invalid phone number", () => {
    const phoneNumberInput = screen.getByLabelText("Phone Number");
    fireEvent.change(phoneNumberInput, { target: { value: "123" } });
    submitForm();
    expect(screen.getByText("Please match the format requested.")).toBeInTheDocument();
  });

});
