import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import AxiosInstance from '@/utils/AxiosInstance';
import SavedJobListPage from '../saved-jobs/SavedJobsListPage';

const noSavedJobsData = []

const noSavedJobsJobSeeker = {
    "user": {
        "user_id": 1,
    }
}

const savedJobsJobSeeker = {
    "user": {
        "user_id": 2,
    }
}

const savedJobsData = [{
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
}]

const addresses = [{
    "id:": 501,
    "country": "France",
},
{
    "id": 502,
    "country": "France",
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
            if (url == `api/job-seeker/1/saved-jobs/`) {
                return Promise.resolve({ data: noSavedJobsData })
            }
            else if (url == `api/job-seeker/2/saved-jobs/`) {
                return Promise.resolve({ data: savedJobsData })
            }
            else if (url == `api/addresses/`) {
                return Promise.resolve({ data: addresses }) //For Job Filter call
            }
            else {
                return Promise.resolve({ data: { "company_name": "The Company" } }) //For job summary call
            }
        }),
    },
}));

vi.mock("@/context/AuthContext", () => ({
    __esModule: true,
    default: React.createContext()
}));

describe('SavedJobsListPage component with no saved jobs', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={noSavedJobsJobSeeker}>
                        <SavedJobListPage />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test("renders no jobs when no saved jobs found", async () => {
        const noJobsFound = screen.getByText("No Saved jobs");

        expect(noJobsFound).toBeInTheDocument();
        expect(AxiosInstance.get).toBeCalledWith(`api/job-seeker/1/saved-jobs/`);
    });

});

describe('SavedJobsListPage component with saved jobs', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={savedJobsJobSeeker}>
                        <SavedJobListPage />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test("renders job list when saved jobs found", async () => {
        const noJobsFound = screen.queryByText("No Saved jobs");
        const job1 = screen.getByText("Administrator, local government");
        const job2 = screen.getByText("Contracting civil engineer");

        expect(noJobsFound).toBeNull();
        expect(job1).toBeInTheDocument();
        expect(job2).toBeInTheDocument();
        expect(AxiosInstance.get).toBeCalledWith(`api/job-seeker/2/saved-jobs/`);
    });

});


