import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import JobApplicantsPage from '../JobApplicants';

const data = [
    {
        "id": 54,
        "date_applied": "2024-03-18",
        "status": "U",
        "decision": "U",
        "job_seeker": 27,
        "resume": 154,
        "job": 7
    },
    {
        "id": 68,
        "date_applied": "2024-03-18",
        "status": "U",
        "decision": "U",
        "job_seeker": 60,
        "resume": 168,
        "job": 7
    }
]

// vi.mock("@/features/employer/job_applicants/ApplicantSummary", async (importOriginal) => {
//     const actual = await importOriginal()
//     return {
//         <div data- testid="mock-applicationsummary" ></div >
//     }
// })

vi.mock("@/features/employer/job_applicants/ApplicantSummary", () => ({
    default: vi.fn(({ children }) => <div data-testid="mock-applicationsummary" >{children}</div >)
})
)

const navigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNavigate: () => navigate,
        useParams: () => ({
            jobId: 7
        })
    }
})

vi.mock("@/utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn(() => {
            return Promise.resolve({
                data: data
            })
        }),
    },
}));

describe('JobApplicants component', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobApplicantsPage />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test("renders ApplicationSummary component", async () => {
        const component = await screen.getAllByTestId("mock-applicationsummary")[0];
        expect(component).toBeInTheDocument();
    });

    test("renders title", async () => {
        const title = await screen.findByText("Matched applicants");
        expect(title).toBeInTheDocument();
    })

    test("renders correCt number of applications", async () => {
        const applications = await screen.getAllByTestId("mock-applicationsummary");
        expect(applications).toHaveLength(2);
    });

    test("renders Job Details button", async () => {
        const button = await screen.findByRole("button");
        expect(button).toBeInTheDocument;
        expect(button).toHaveTextContent("Job Details")
    });

    test("Job Details button redirects correctly", async () => {
        const button = await screen.findByRole("button");
        await act(async () => {
            fireEvent.click(button)
        })
        expect(navigate).toHaveBeenCalledWith(`/employer/job-details/7`)
    });

});