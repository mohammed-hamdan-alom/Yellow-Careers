import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ApplicantSummary from '../ApplicantSummary';

const navigate = vi.fn();

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
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <ApplicantSummary id={1} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test("renders job-seeker's name", async () => {
        const name = await screen.findByText("John Doe");
        expect(name).toBeInTheDocument();
    });

    test("renders button to show application", async () => {
        const button = await screen.findByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Show Application")
    })

    test('navigates to application-details on click', async () => {
        await act(async () => {
            fireEvent.click(screen.getByText("Show Application"))
        })
        expect(navigate).toHaveBeenCalledWith(`/employer/application-details/1`)
    })

});