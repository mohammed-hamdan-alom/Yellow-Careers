import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ApplicantSummary from '../ApplicantSummary';
import AuthContext from '@/context/AuthContext';

const navigate = vi.fn();

const employer = {
    "user": {
        "user_type": "employer",
        "user_id": 1
    }
}

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
        get: vi.fn(() => {
            return Promise.resolve({
                data: {
                    "first_name": "John",
                    "last_name": "Doe"
                }
            })
        }),
    },
}));

describe('ApplicantSummary component', () => {

    beforeEach(async () => {

    })

    afterEach(cleanup);

    test("renders applicant card info", async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={employer}>
                        <ApplicantSummary application_id={1} status="U" decision="R" />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })

        const name = await screen.findByText("John Doe");
        expect(name).toBeInTheDocument();

        const status = await screen.findByText("New")
        expect(status).toBeInTheDocument();

    })

    test('navigates to application-details on click', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={employer}>
                        <ApplicantSummary application_id={1} status="U" decision="R" />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })
        await act(async () => {
            fireEvent.click(screen.getByText("John Doe"))
        })
        expect(navigate).toHaveBeenCalledWith(`/employer/application-details/1`)
    })

    test('renders decision when card is read', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={employer}>
                        <ApplicantSummary application_id={1} status="R" decision="R" />
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        })

        const status = await screen.findByText("Rejected")
        expect(status).toBeInTheDocument();
    })
});