import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import JobListPage from '../job-list-page/JobListPage';
import AuthContext from '@/context/AuthContext';
import AxiosInstance from '@/utils/AxiosInstance';

const updateToken = vi.fn();

const noResumeData = {
    "detail": "Not found."
}
const resumeData = {
    "id": 1
}

const noResumeJobSeeker = {
    "user": {
        "user_id": 1,
    },
    updateToken
}

const resumeJobSeeker = {
    "user": {
        "user_id": 2,
    },
    updateToken
}



const jobsData = [{
    "id": 1,
    "title": "Administrator, local government",
    "description": "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
    "address": { "country": "France" },
    "job_type": "FT",
    "salary": 44976
},
{
    "id": 2,
    "title": "Contracting civil engineer",
    "description": "Fugiat adipisci tempore. Consectetur veniam quaerat deleniti assumenda sapiente.",
    "address": { "country": "France" },
    "job_type": "IN",
    "salary": 74726
},
{
    "id": 3,
    "title": "Office manager",
    "description": "Pariatur magnam quisquam distinctio. Repudiandae asperiores quidem dolor. Voluptatum omnis dolorem magnam et commodi magnam officiis.",
    "address": { "country": "Germany" },
    "job_type": "TM",
    "salary": 35685
},
{
    "id": 4,
    "title": "Chief Executive Officer",
    "description": "Aliquid mollitia vitae blanditiis dignissimos dignissimos. Maiores architecto voluptatum ex. Corrupti voluptatem esse eum nostrum adipisci explicabo.",
    "address": { "country": "Germany" },
    "job_type": "PT",
    "salary": 61939
}]

const navigate = vi.fn();


vi.mock("@/components/ui/label", () => ({
    Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>)
}))

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNavigate: () => navigate
    }
})

vi.mock("@/utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn((url) => {
            if (url == `api/job-seeker/1/resume/`) {
                return Promise.resolve({ data: noResumeData })
            }
            else if (url == `api/job-seeker/2/resume/`) {
                return Promise.resolve({ data: resumeData })
            }
            else {
                return Promise.resolve({ data: jobsData })
            }
        }),
    },
}));

vi.mock("@/context/AuthContext", () => ({
    __esModule: true,
    default: React.createContext()
}));

describe('JobListPage component with no resume', () => {

    beforeEach(async () => {
        await act(async () => {
            render( 
                <MemoryRouter>
                    <AuthContext.Provider value={noResumeJobSeeker}>
                        <JobListPage />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test("renders no jobs when no resume found", async () => {
        const label = await screen.getByTestId("mock-label");
        const noResumeText = await screen.getByText("Error loading the jobs, please create a resume. If you have already done so, reload the page")

        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent("Job List")
        expect(noResumeText).toBeInTheDocument();
        expect(AxiosInstance.get).toBeCalledWith(`api/job-seeker/1/resume/`)
        expect(AxiosInstance.get).not.toBeCalledWith(`api/job-seeker/1/matched-jobs/`)
    });

});

describe('JobListPage component with resume', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={resumeJobSeeker}>
                        <JobListPage />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test("renders job list when resume found", async () => {
        const jobListLabel = await screen.getByText("Job List")
        const noResumeText = await screen.queryByText("Error loading the jobs, please create a resume. If you have already done so, reload the page")
        const job1 = await screen.getByText("Administrator, local government")
        const job2 = await screen.getByText("Contracting civil engineer")
        const job3 = await screen.getByText("Office manager")
        const job4 = await screen.getByText("Chief Executive Officer")

        expect(AxiosInstance.get).toBeCalledWith(`api/job-seeker/2/matched-jobs/`)
        expect(jobListLabel).toBeInTheDocument();
        expect(job1).toBeInTheDocument();
        expect(job2).toBeInTheDocument();
        expect(job3).toBeInTheDocument();
        expect(job4).toBeInTheDocument();
        expect(noResumeText).toBeNull();
    });

});


