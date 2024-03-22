import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import JobDetailsEmployer from '../JobDetailsEmployer';
import AxiosInstance from '@/utils/AxiosInstance';
import AuthContext from '@/context/AuthContext';
const data = {
    "job": {
        "id": 1,
        "title": "Administrator, local government",
        "description": "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
        "address": {
            "post_code": "POSTCODE",
            "city": "CITY",
            "country": "COUNTRY",
        },
        "job_type": "FT",
        "salary": 44976,
        "company": {
            "id": 1,
            "company_name": "The Company",
            "website": "http://www.morris-murphy.org/",
            "about": "This is a Company"
        }
    },
    "questions": [{
        "id": 1,
        "question": "Soluta et eos quam quisquam sit reprehenderit. Illum at explicabo molestias. Inventore consequuntur numquam consequatur nulla ab minima.",
        "job": 1
    },
    {
        "id": 2,
        "question": "Quo commodi saepe. Labore amet numquam sed itaque reiciendis.",
        "job": 1
    }],
    "company_employers": [{
        "id": 1,
        "is_company_admin": 1,
        "company_id": 1,
        "first_name": "John",
        "last_name": "Doe"
    },
    {
        "id": 2,
        "is_company_admin": 0,
        "company_id": 1,
        "first_name": "Jane",
        "last_name": "Doe"
    },
    {
        "id": 3,
        "is_company_admin": 0,
        "company_id": 1,
        "first_name": "Jonathon",
        "last_name": "Doe"
    },
    {
        "id": 4,
        "is_company_admin": 0,
        "company_id": 1,
        "first_name": "Joseph",
        "last_name": "Doe"
    }],
    "employers": [{
        "id": 1,
        "is_company_admin": 1,
        "company_id": 1,
        "first_name": "John",
        "last_name": "Doe"
    },
    {
        "id": 2,
        "is_company_admin": 0,
        "company_id": 1,
        "first_name": "Jane",
        "last_name": "Doe"
    }]
}

const employer = {
    "user": {
        "user_type": "employer",
        "user_id": 1
    }
}

const navigate = vi.fn()

vi.mock("@/components/job-details/JobDetails", () => ({
    default: vi.fn(() => <div data-testid="mock-jobdetails" ></div >)
}))

vi.mock("@/components/ui/label", () => ({
    Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>)
}))

vi.mock("@/components/ui/button", () => ({
    Button: vi.fn(({ children }) => <button data-testid="mock-button">{children}</button>)
}))

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNavigate: () => navigate,
        useParams: () => ({
            jobId: 1
        })
    }
})

vi.mock("@/utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn((url) => {
            if (url == "api/jobs/1/") {
                return Promise.resolve({ data: data.job })
            }
            else if (url == `api/jobs/1/company/`) {
                return Promise.resolve({ data: data.job.company })
            }
            else if (url == `api/jobs/1/address/`) {
                return Promise.resolve({ data: data.job.address })
            }
            else if (url == `api/jobs/1/questions/`) {
                return Promise.resolve({ data: data.questions })
            }
            else if (url == `api/job/1/employers/`) {
                return Promise.resolve({ data: data.employers })
            }
            else if (url == `api/employers/company/1/`) {
                return Promise.resolve({ data: data.company_employers })
            }
            return Promise.resolve({ data: {} })
        }),
        delete: vi.fn((url) => { return url }),
        post: vi.fn((url) => { return url })
    },
}));

vi.mock("@/context/AuthContext", () => ({
    __esModule: true,
    default: React.createContext()
}));

describe('JobDetailsEmployer component', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={employer}>
                        <JobDetailsEmployer />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test('renders See Applicants button', async () => {
        const button = await screen.getAllByRole("button")[0]
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("See Applicants")
    });

    test('See Applicants button redirects to job-applicants', async () => {
        const button = await screen.getAllByRole("button")[0]
        await act(async () => {
            fireEvent.click(button)
        })
        expect(navigate).toBeCalledWith(`/employer/job-applicants/1`)
    })

    test('renders JobDetails component', async () => {
        const jobDetailsComponent = await screen.findByTestId("mock-jobdetails")
        expect(jobDetailsComponent).toBeInTheDocument();
    })

    test('lists all questions', async () => {
        const question1 = await screen.findByText(data.questions[0].question)
        const question2 = await screen.findByText(data.questions[1].question)
        expect(question1).toBeInTheDocument()
        expect(question2).toBeInTheDocument()
    })

    test('lists all employers on the job', async () => {
        const employer1 = await screen.findAllByText(data.company_employers[0].first_name + " " + data.company_employers[0].last_name)
        const employer2 = await screen.findAllByText(data.company_employers[1].first_name + " " + data.company_employers[1].last_name)
        const employer3 = (await screen.findByText(data.company_employers[2].first_name + " " + data.company_employers[2].last_name)).querySelector("h5")
        const employer4 = await (await screen.findByText(data.company_employers[3].first_name + " " + data.company_employers[3].last_name)).querySelector("h5")
        expect(employer1).toHaveLength(1)
        expect(employer2).toHaveLength(2) //Appears in both employer job list and add employer list
        expect(employer3).not.toBeInTheDocument()
        expect(employer4).not.toBeInTheDocument()
    })

    test('render employer remove button ', async () => {
        const removeButton = await screen.findByText("Remove")
        expect(removeButton).toBeInTheDocument()
    })

    test('employer remove button renders for the correct employer', async () => {
        const removeButton = await screen.findByText("Remove")
        await act(async () => {
            fireEvent.click(removeButton)
        })
        const employerToRemove = {
            "employer": 2,
            "job": 1,
        }
        expect(AxiosInstance.delete).toBeCalledWith("api/employer-job-relations/delete/1/2/", employerToRemove)
    })

    test('employer dropdown contains all employers in company', async () => {
        const employer2 = await screen.getAllByRole("option")[0]
        const employer3 = await screen.getAllByRole("option")[1]
        const employer4 = await screen.getAllByRole("option")[2]
        expect(employer2).toBeInTheDocument()
        expect(employer3).toBeInTheDocument()
        expect(employer4).toBeInTheDocument()
        expect(employer2).toHaveTextContent("Jane Doe")
        expect(employer3).toHaveTextContent("Jonathon Doe")
        expect(employer4).toHaveTextContent("Joseph Doe")
    })

    test('dropdown adds employer to job successfully', async () => {
        const employerDropDown = await screen.getByTestId("employerDropDown")
        const submit = await screen.getByText("Submit")
        const employerToAdd = { "employer": "3", "job": 1 }
        await act(async () => {
            fireEvent.change(employerDropDown, { target: { value: 3 } });
            fireEvent.click(submit)
        })
        expect(AxiosInstance.post).toBeCalledWith('api/employer-job-relations/create/', employerToAdd)
    })
});