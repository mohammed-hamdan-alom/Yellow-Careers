import { vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CompanyProfilePage from "../CompanyProfilePage";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import AuthContext from "@/context/AuthContext";
import React from "react";

const mockUser = {
  user: { user_id: 115, email: "kcarter@example.net", user_type: "job_seeker" },
};
const mockEmployerResponse = {
  data: {
    id: 115,
    email: "kcarter@example.net",
    first_name: "Billy",
    last_name: "O'Sullivan",
    other_names: "bean + cheese + begel",
    phone_number: "+44(0)1414960525",
    is_company_admin: false,
    company: 25,
  },
};
const mockAdminEmployerResponse = {
  data: {
    id: 115,
    email: "kcarter@example.net",
    first_name: "Billy",
    last_name: "O'Sullivan",
    other_names: "bean + cheese + begel",
    phone_number: "+44(0)1414960525",
    is_company_admin: true,
    company: 25,
  },
};
const mockCompanyResponse = {
  data: {
    id: 25,
    company_name: "Williamson and Sons",
    website: "https://www.burns.co.uk/",
    about: "Dolor et ea modi. Ducimus delectus ut accusantium.",
  },
};
const mockEmployersResponse = {
  data: [
    {
      id: 150,
      email: "denise50@example.net",
      first_name: "Margaret",
      last_name: "Field",
      other_names: "bean + cheese + begel",
      phone_number: "01164960220",
      is_company_admin: false,
      company: 25,
    },
    {
      id: 115,
      email: "kcarter@example.net",
      first_name: "Billy",
      last_name: "O'Sullivan",
      other_names: "bean + cheese + begel",
      phone_number: "+44(0)1414960525",
      is_company_admin: true,
      company: 25,
    },
    {
      id: 184,
      email: "joel34@example.net",
      first_name: "Guy",
      last_name: "Wilson",
      other_names: "bean + cheese + begel",
      phone_number: "0306 9990733",
      is_company_admin: true,
      company: 25,
    },
  ],
};

describe("CompanyProfilePage component", () => {
  const user = mockUser;
  const companyResponse = mockCompanyResponse;
  const employersResponse = mockEmployersResponse;

  test("renders company profile correctly", async () => {
    const employerResponse = mockEmployerResponse;

    render(
      <MemoryRouter>
        <AuthContext.Provider value={user}>
          <CompanyProfilePage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(companyResponse.data.company_name)
    ).toBeInTheDocument();

    const websiteInput = screen.getByLabelText("Website:");
    expect(websiteInput).toHaveValue(companyResponse.data.website);

    const aboutInput = screen.getByLabelText("About:");
    expect(aboutInput).toHaveValue(companyResponse.data.about);

    //TODO: CHECK IF EMPLYERS ARE RENDERED

  });

});
