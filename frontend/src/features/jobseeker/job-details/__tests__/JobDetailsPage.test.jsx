import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AxiosInstance from '@/utils/AxiosInstance';
import JobDetails from '../job-datails-page/JobDetailsPage';
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
    "resume": {
        "id": 1
    },
    "applied_jobs": [],
    "saved_jobs": [],
}



const job_seeker1 = {
    "user": {
        "user_type": "job_seeker",
        "user_id": 1
    }
}


const data2 = {
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
    "questions": [],
    "resume": {
        "id": 1
    },
    "applied_jobs": [{ "id": 1 }],
    "saved_jobs": [],
}

const job_seeker2 = {
    "user": {
        "user_type": "job_seeker",
        "user_id": 2
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

vi.mock("@/context/AuthContext", () => ({
    __esModule: true,
    default: React.createContext()
}));

vi.mock("@/utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn((url) => {
            if (url == "api/jobs/1/") {
                return Promise.resolve({ data: data.job })
            }
            else if (url == "api/jobs/2/") {
                return Promise.resolve({ data: data2.job })
            }
            else if (url == `api/jobs/1/company/`) {
                return Promise.resolve({ data: data.job.company })
            }
            else if (url == `api/jobs/2/company/`) {
                return Promise.resolve({ data: data2.job.company })
            }
            else if (url == `api/jobs/1/address/`) {
                return Promise.resolve({ data: data.job.address })
            }
            else if (url == `api/jobs/2/address/`) {
                return Promise.resolve({ data: data2.job.address })
            }
            else if (url == `api/jobs/1/questions/`) {
                return Promise.resolve({ data: data.questions })
            }
            else if (url == `api/jobs/2/questions/`) {
                return Promise.resolve({ data: data2.questions })
            }
            else if (url == `api/job-seeker/1/resume/`) {
                return Promise.resolve({ data: data.resume })
            }
            else if (url == `api/job-seeker/2/resume/`) {
                return Promise.resolve({ data: data2.resume })
            }
            else if (url == `api/job-seeker/1/applied-jobs/`) {
                return Promise.resolve({ data: data.applied_jobs })
            }
            else if (url == `api/job-seeker/2/applied-jobs/`) {
                return Promise.resolve({ data: data2.applied_jobs })
            }
            else if (url == `api/job-seeker/1/saved-jobs/`) {
                return Promise.resolve({ data: data.saved_jobs })
            }
            else if (url == `api/job-seeker/2/saved-jobs/`) {
                return Promise.resolve({ data: data2.saved_jobs })
            }
            return Promise.resolve({ data: { id: 1 } })
        }),
        delete: vi.fn(() => { return Promise.resolve({}) }),
        then: vi.fn(() => { }),
        post: vi.fn(() => { return Promise.resolve({}) })
    },
}));

describe('JobDetailsPage component with questions', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={job_seeker1}>
                        <JobDetails />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
    })

    afterEach(async () => {
        cleanup
        vi.clearAllMocks()
    });

    test('renders JobDetails component', async () => {
        const jobDetailsComponent = await screen.findByTestId("mock-jobdetails")
        expect(jobDetailsComponent).toBeInTheDocument();
    })

    test("renders apply and save buttons correctly", async () => {
        const applyButton = await screen.findByText("Apply")
        const saveButton = await screen.findByText("Save")

        expect(applyButton).toBeInTheDocument()
        expect(saveButton).toBeInTheDocument()
    })

    test("apply button functions correctly with questions", async () => {
        const applyButton = await screen.findByText("Apply")

        await act(async () => {
            fireEvent.click(applyButton)
        })

        expect(navigate).toBeCalledWith('questions/')
    })

    test("save button functions correctly for unsaved job", async () => {
        const saveButton = await screen.findByText("Save")

        await act(async () => {
            fireEvent.click(saveButton)
        })

        expect(AxiosInstance.post).toBeCalledWith(`api/saved-jobs/create/`, { "job_seeker": 1, "job": 1 })
    })
});

describe("JobDetailsPage component has already applied job", async () => {
    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={job_seeker2}>
                        <JobDetails />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup)

    test("renders see application button correctly", async () => {
        const applyButton = await screen.findByText("See Application")
        expect(applyButton).toBeInTheDocument()
    })

    test("see application button functions correctly", async () => {
        const applyButton = await screen.findByText("See Application")

        await act(async () => {
            fireEvent.click(applyButton)
        })

        expect(AxiosInstance.get).toBeCalledWith(`api/applications/2/1`)
        expect(navigate).toBeCalledWith(`/job-seeker/application-details/1`)
    })
})