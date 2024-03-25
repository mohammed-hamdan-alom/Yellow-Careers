import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import CompanyProfilePage from "../CompanyProfilePage";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import React from "react";

const mockAdminUser = {
  user: { user_id: 150, email: "denise50@example.net", user_type: "employer" },
};

const mockUser = {
  user: { user_id: 115, email: "kcarter@example.net", user_type: "employer" },
};

const mockEmployerResponse = {
  data: {
    id: 115,
    email: "kcarter@example.net",
    first_name: "Billy",
    last_name: "O'Sullivan",
    other_names: "Charles",
    phone_number: "+44(0)1414960525",
    is_company_admin: false,
    company: 25,
  },
};

const mockAdminEmployerResponse = {
  data: {
    id: 150,
    email: "denise50@example.net",
    first_name: "Margaret",
    last_name: "Field",
    other_names: "Elizabeth",
    phone_number: "01164960220",
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
      other_names: "Elizabeth",
      phone_number: "01164960220",
      is_company_admin: true,
      company: 25,
    },
    {
      id: 115,
      email: "kcarter@example.net",
      first_name: "Billy",
      last_name: "O'Sullivan",
      other_names: "Charles",
      phone_number: "+44(0)1414960525",
      is_company_admin: false,
      company: 25,
    },
    {
      id: 184,
      email: "joel34@example.net",
      first_name: "Guy",
      last_name: "Wilson",
      other_names: "John",
      phone_number: "0306 9990733",
      is_company_admin: true,
      company: 25,
    },
  ],
};

const mockUpdateCompanyResponse = {
  data: {
    id: 25,
    company_name: "New Company Name",
    website: "https://www.burns.co.uk/",
    about: "Dolor et ea modi. Ducimus delectus ut accusantium.",
  },
  status: 200,
  statusText: "OK",
  headers: {
    "content-length": "141",
    "content-type": "application/json",
  },
  request: {},
};

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn((url) => {
      if (url === "api/employers/150") {
        return Promise.resolve(mockAdminEmployerResponse);
      } else if (url === "api/companies/25") {
        return Promise.resolve(mockCompanyResponse);
      } else if (url === "api/companies/25/employers") {
        return Promise.resolve(mockEmployersResponse);
      } else if (url === "api/employers/115") {
        return Promise.resolve(mockEmployerResponse);
      } else {
        return Promise.resolve({ data: [] });
      }
    }),

    put: vi.fn((url, data) => {
      if (url === "api/companies/25/update/") {
        return Promise.resolve(mockUpdateCompanyResponse);
      } else {
        return Promise.resolve({ data: [] });
      }
    }),
  },
}));

describe("CompanyProfilePage component", () => {
  test("renders company profile correctly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockUser}>
            <CompanyProfilePage />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    expect(screen.getByText("About:")).toBeInTheDocument();
    expect(screen.getByText("Website:")).toBeInTheDocument();
    expect(screen.getByText("Employers:")).toBeInTheDocument();
  });

  test("information is displayed correctly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockUser}>
            <CompanyProfilePage />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    expect(
      await screen.findByText(mockCompanyResponse.data.company_name)
    ).toBeInTheDocument();

    const websiteInput = screen.getByLabelText("Website:");
    expect(websiteInput).toHaveValue(mockCompanyResponse.data.website);

    const aboutInput = screen.getByLabelText("About:");
    expect(aboutInput).toHaveValue(mockCompanyResponse.data.about);

    // Test employers show up
    await waitFor(() => {
      expect(screen.getByText(/Employers/i)).toBeInTheDocument();
      mockEmployersResponse.data.forEach((employer) => {
        expect(screen.getByText((content, element) => {
          return element.tagName.toLowerCase() === 'label' &&
            element.textContent.includes(employer.first_name);
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
          return element.tagName.toLowerCase() === 'label' &&
            element.textContent.includes(`Email: ${employer.email}`);
        })).toBeInTheDocument();
      });
    });
  });

  test("Edit button shows as admin", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAdminUser}>
            <CompanyProfilePage />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });
  });

  test("Edit button doesn't show when not admin", async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockUser}>
          <CompanyProfilePage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Edit")).toBeNull();
    });
  });

  test("Edit button toggles edit mode", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAdminUser}>
            <CompanyProfilePage />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByText("Update")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    await waitFor(() => {
      const companyNameLabel = screen.getByLabelText("Company Name:");
      const aboutLabel = screen.getByLabelText("About:");
      const websiteLabel = screen.getByLabelText("Website:");

      expect(companyNameLabel).toBeInTheDocument();
      expect(aboutLabel).toBeInTheDocument();
      expect(websiteLabel).toBeInTheDocument();
    });
    //TEST EMPLOYERS ARE STILL THERE
    await waitFor(() => {
      expect(screen.getByText(/Employers/i)).toBeInTheDocument();
      mockEmployersResponse.data.forEach((employer) => {
        expect(screen.getByText((content, element) => {
          return element.tagName.toLowerCase() === 'label' &&
            element.textContent.includes(employer.first_name);
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
          return element.tagName.toLowerCase() === 'label' &&
            element.textContent.includes(`Email: ${employer.email}`);
        })).toBeInTheDocument();
      });
    });
  });

  test("Update and cancel buttons work", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAdminUser}>
            <CompanyProfilePage />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByText("Update")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    const companyNameInput = screen.getByLabelText("Company Name:");
    fireEvent.change(companyNameInput, {
      target: { value: "New Company Name" },
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    screen.findByText(mockCompanyResponse.data.company_name);

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByText("Update")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    const companyNameInput2 = screen.getByLabelText("Company Name:");
    fireEvent.change(companyNameInput2, {
      target: { value: "New Company Name" },
    });

    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText("New Company Name")).toBeInTheDocument();
    });
  });
});
