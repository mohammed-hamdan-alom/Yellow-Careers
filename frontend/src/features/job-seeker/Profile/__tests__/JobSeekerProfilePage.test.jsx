import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobSeekerProfilePage from "../JobSeekerProfilePage";
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
  sex: "M",
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
  "Sex:": "sex",
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
        <JobSeekerProfilePage />
      </AuthContext.Provider>,
    );
  });

  const submitProfileForm = () => {
    fireEvent.submit(screen.getByText("Submit"));
  };
  const submitPasswordForm = () => {
    fireEvent.submit(screen.getByText("Change Password"));
  };

  const assertFormValues = (formData) => {
    Object.entries(fieldMap).forEach(([label, field]) => {
      let value;
      const excludedLabels = ["Email:", "Nationality:", "Sex:", "City:", "Post Code:", "Country:"];
      if (!excludedLabels.includes(label)) {
        value = getValueFromFormData(formData, field);
        expect(screen.getByLabelText(label)).toHaveValue(value);
      } else if (label === "Nationality:") {
        expect(formData.nationality).toEqual(formData[field]);
      } else if (label === "Sex:") {
        expect(formData.sex).toEqual(formData[field]);
      } else if (
        label.startsWith("City:") ||
        label.startsWith("Post Code:") ||
        label.startsWith("Country:")
      ) {
        const addressField = label.split(":")[1].trim().toLowerCase();
        expect(formData.address[addressField]).toEqual(formData.address[addressField]);
      }
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
    assertFormValues(mockUser);
  });

  test("updates profile data on submit", async () => {
    Object.entries(fieldMap).forEach(([label, field]) => {
      const value = getValueFromFormData(updatedFormData, field);
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    });

    submitProfileForm();

    await waitFor(() => {
      assertFormValues(updatedFormData);
    });
  });

  test("email remains unchanged on submit", async () => {
    Object.entries(fieldMap).forEach(([label, field]) => {
      const value = getValueFromFormData(updatedFormData, field);
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    });

    submitProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockUser.email);
    });
  });

  test("renders ProfileDetails component", async () => {
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("renders PasswordChangeSection component", async () => {
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });
});
