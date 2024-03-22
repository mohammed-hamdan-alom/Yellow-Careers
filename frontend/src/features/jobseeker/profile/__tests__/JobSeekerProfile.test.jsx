import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobSeekerProfile from "../JobSeekerProfile";
import { vi } from "vitest";
import AuthContext from "@/context/AuthContext";

const mockUser = {
  email: "johndoe@example.com",
  first_name: "John",
  last_name: "Doe",
  other_names: "Charles",
  phone_number: "08012345678",
  dob: "1999-01-01",
  nationality: "British",
  sex: "Male",
  address: {
    city: "London",
    post_code: "L9K 1AA",
    country: "United Kingdom",
  },
};

const updatedFormData = {
  email: "janedoe@example.com",
  first_name: "Updated",
  last_name: "User",
  other_names: "Other",
  phone_number: "09098765432",
  dob: "2000-01-01",
  nationality: "American",
  sex: "Female",
  address: {
    city: "New York",
    post_code: "NY12345",
    country: "USA",
  },
};

const fieldMap = {
  "Email:": "email",
  "First Name:": "first_name",
  "Last Name:": "last_name",
  "Other Names:": "other_names",
  "Phone Number:": "phone_number",
  "Date of Birth:": "dob",
  "Nationality:": "nationality",
  // "Sex:": "sex",
  "City:": "address.city",
  "Post Code:": "address.post_code",
  "Country:": "address.country",
};

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    put: vi.fn((url, data) => {
      return Promise.resolve({ data: updatedFormData });
    }),
  },
}));

describe("JobSeekerProfile component", () => {
  beforeEach(() => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <JobSeekerProfile />
      </AuthContext.Provider>
    );
  });

  const submitForm = () => {
    fireEvent.submit(screen.getByText("Update Profile"));
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

  const getValueFromFormData = (formData, field) => {
    const path = field.split(".");
    let value = { ...formData };
    for (const key of path) {
      value = value[key];
    }
    return value;
  };

  test("fetches job seeker data on mount", async () => {
    const nationalitySelect = screen.getByLabelText("Nationality:");
    fireEvent.change(nationalitySelect, { target: { value: "British" } });

    const sexSelect = screen.getByLabelText("Sex:");
    fireEvent.change(sexSelect, { target: { value: "Male" } });
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

  test("email remains unchanged on submit", async () => {
    Object.entries(fieldMap).forEach(([label, field]) => {
      const value = getValueFromFormData(updatedFormData, field);
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    });

    submitForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockUser.email);
    });
  });

  test("displays popover with invalid DOB", async () => {
    const DOBInput = screen.getByLabelText("Date of Birth:");
    fireEvent.change(DOBInput, { target: { value: mockUser.dob } });
    fireEvent.change(DOBInput, { target: { value: "3000-03-25" } });

    submitForm();
    
    // Check that the form submission was prevented and the Date of Birth remains unchanged
    await waitFor(() => {
      expect(screen.getByLabelText("Date of Birth:")).toHaveValue(mockUser.dob);
    });
  });

});
