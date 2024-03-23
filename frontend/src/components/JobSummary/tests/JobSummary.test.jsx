import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import JobSummary from "@/components/JobSummary/JobSummary"
import AxiosInstance from "@/utils/AxiosInstance"
import AuthContext from '@/context/AuthContext';

const data = {
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
    "company": "The Company"
}

const employer = {
    "user": { "user_type": "employer" }
}

const jobseeker = {
    "user_type": "jobseeker"
}

vi.mock('@/components/job-card/JobCard', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        JobCard: vi.fn(({ children }) => <div data-testid="mock-jobcard">{children}</div>)
    };
});

vi.mock("@/utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn(() => {
            return Promise.resolve({ data: { "company_name": "The Company" } })
        }),
    },
}));

vi.mock("@/context/AuthContext", () => ({
    __esModule: true,
    default: React.createContext()
}));

const navigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNavigate: () => navigate
    }
})

describe('JobSummary component', () => {

    beforeEach(() => {

    })

    afterEach(cleanup);

    test('renders JobCard title', async () => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobSummary job={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
        const jobCard = await screen.findByText(data.title);
        expect(jobCard).toBeInTheDocument();
    });

    test('click as employer redirects to correct URL', async () => {

        act(() => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={employer}>
                        <JobSummary job={data} />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
        act(() => {
            fireEvent.click(screen.getByText(data.title))
        })
        expect(navigate).toHaveBeenCalledWith("/employer/job-details/1");

    })

});