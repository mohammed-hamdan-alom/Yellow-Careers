import { vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CompanyProfilePage from '../CompanyProfilePage';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import AxiosInstance from '@/utils/AxiosInstance';

const mockUser = { user_id: 'mockUserId' }; // Define a mock user object
vi.mock('@/context/AuthContext', () => ({
  __esModule: true,
  createContext: () => ({
    user: mockUser, // Mock the user object
  }),
}));

// Mocking AuthProvider
vi.mock("@/context/AuthContext", async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      AuthProvider: ({ children }) => <div>{children}</div>, // Mock AuthProvider component
    };
  });
  
  // Mocking AxiosInstance
  vi.mock("@/utils/AxiosInstance", async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      default: {
        ...actual.default,
        get: vi.fn(async () => {
          return Promise.resolve({ data: {} });
        }),
        put: vi.fn(async () => {
          return Promise.resolve({ data: {} });
        }),
        // Add any other mocked methods as needed
      },
    };
  });

// vi.mock("@/utils/AxiosInstance", async (importOriginal) => {
//     const actual = await importOriginal();
//     return {
//         ...actual,
//         default: {
//             ...actual.default,
//             get: vi.fn(async () => {
//                 return Promise.resolve({ data: {} });
//             }),
//             put: vi.fn(async () => {
//                 return Promise.resolve({ data: {} });
//             }),
//             // Add any other mocked methods as needed
//         }
//     };
// });


describe('CompanyProfilePage component', () => {
  test('renders company profile correctly', async () => {
    // Mocking data
    const employerResponse = { data: {
        "id": 115,
        "email": "kcarter@example.net",
        "first_name": "Billy",
        "last_name": "O'Sullivan",
        "other_names": "bean + cheese + begel",
        "phone_number": "+44(0)1414960525",
        "is_company_admin": true,
        "company": 25
    } };
    const companyResponse = { data:{
        company_name: "Jones-Doherty",
        about: "Doloremque accusantium eos id. Sequi ut eos doloribus ipsa. Culpa recusandae commodi ex harum sequi. Molestiae deserunt harum dolores quos dicta eos.",
        website: "http://hall.com/",
        id: 2,
      } 
    };
    const employersResponse = { data: 
        [
            {
                "id": 150,
                "email": "denise50@example.net",
                "first_name": "Margaret",
                "last_name": "Field",
                "other_names": "bean + cheese + begel",
                "phone_number": "01164960220",
                "is_company_admin": false,
                "company": 25
            },
            {
                "id": 115,
                "email": "kcarter@example.net",
                "first_name": "Billy",
                "last_name": "O'Sullivan",
                "other_names": "bean + cheese + begel",
                "phone_number": "+44(0)1414960525",
                "is_company_admin": true,
                "company": 25
            },
            {
                "id": 184,
                "email": "joel34@example.net",
                "first_name": "Guy",
                "last_name": "Wilson",
                "other_names": "bean + cheese + begel",
                "phone_number": "0306 9990733",
                "is_company_admin": true,
                "company": 25
            }
        ]
     };
    
    // Mocking AxiosInstance.get
    AxiosInstance.get.mockImplementationOnce(async () => employerResponse);
    AxiosInstance.get.mockImplementationOnce(async () => companyResponse);
    AxiosInstance.get.mockImplementationOnce(async () => employersResponse);

    // Render the component
    render(
      <MemoryRouter>
        <AuthProvider>
          <CompanyProfilePage />
        </AuthProvider>
      </MemoryRouter>
    );

    // Assert that company profile elements are rendered correctly
    expect(await screen.findByText(companyResponse.data.company_name)).toBeInTheDocument();
    // Add more assertions for other elements if needed
  });

  // Add more tests as needed
});
