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

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn((url) => {
      if (url === "api/employers/115") {
        return Promise.resolve(mockEmployerResponse);
      } else if (url === "api/companies/25") {
        return Promise.resolve(mockCompanyResponse);
      } else if (url ==="api/companies/25"/employers ) {
        return Promise.resolve(mockEmployersResponse);
      } else if (url === "api/employers/150") {
        return Promise.resolve(mockAdminEmployerResponse);
      } else {
        return Promise.resolve({data: []});
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

    screen.debug();

    expect(
      await screen.findByText(mockCompanyResponse.data.company_name)
    ).toBeInTheDocument();

    const websiteInput = screen.getByLabelText("Website:");
    expect(websiteInput).toHaveValue(mockCompanyResponse.data.website);

    const aboutInput = screen.getByLabelText("About:");
    expect(aboutInput).toHaveValue(mockCompanyResponse.data.about);

    //Test employers show up
    // await waitFor(() => {
    //     expect(screen.getByText(/Employers/i)).toBeInTheDocument(); // Using a regex matcher to match case-insensitively
    //     employersResponse.data.forEach((employer) => {
    //       expect(screen.getByText(employer.first_name)).toBeInTheDocument();
    //       expect(screen.getByText(`Email: ${employer.email}`)).toBeInTheDocument();
    //     });
    //  });
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

//   test("Edit button toggles edit mode", async () => {
//     const employerResponse = mockAdminEmployerResponse;
    
//     await act(async () => {
//         render(
//           <MemoryRouter>
//             <AuthContext.Provider value={mockAdminUser}>
//               <CompanyProfilePage />
//             </AuthContext.Provider>
//           </MemoryRouter>
//         );
//       });

//     await waitFor(() => {
//       expect(screen.getByText("Edit")).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText("Edit"));

//     await waitFor(() => {
//       expect(screen.getByText("Update")).toBeInTheDocument();
//       expect(screen.getByText("Cancel")).toBeInTheDocument();
//     });

//     //TEST IF THE TEXTAREAS ARE THERE
//     // await waitFor(() => {
//     //   const companyNameLabel = screen.getByLabelText("Company Name:");
//     //   const aboutLabel = screen.getByLabelText("About: ");
//     //   const websiteLabel = screen.getByLabelText("Website: ");

//     //   expect(companyNameLabel).toBeInTheDocument();
//     //   expect(aboutLabel).toBeInTheDocument();
//     //   expect(websiteLabel).toBeInTheDocument();
//     // });
//     //test employers still there
//   });
});
