import { vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AxiosInstance from "@/utils/AxiosInstance";
import AuthContext from '@/context/AuthContext';
import EmployerRegister from "../EmployerRegisterPage";

vi.mock("@/utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        delete: vi.fn().mockResolvedValue({}),
    },
}));

const navigate = vi.fn();
vi.mock("react-router-dom", () => ({
    __esModule: true,
    useNavigate: () => navigate,
    useLocation: () => ({ state: { user_id: '123' } })

}));

describe("EmployerRegister Component", () => {
    const mockRegisterEmployer = vi.fn();
    const user = { user_id: '123' };
    const mockContext = { user, mockRegisterEmployer };
    beforeEach(() => {
        AxiosInstance.delete.mockResolvedValue({});
    });

    it("registers employer", async () => {
        render(
            <AuthContext.Provider value={mockContext}>
                <EmployerRegister />,
            </AuthContext.Provider>
        );
        const passwordField = await screen.getByTestId("password");
        const confirmPasswordField = await screen.getByTestId("confirm-password");
        const firstNameField = await screen.getByTestId("first-name");
        const lastNameField = await screen.getByTestId("last-name");
        const otherNamesField = await screen.getByTestId("other-names");
        const phoneField = await screen.getByTestId("phone-number");

        fireEvent.change(passwordField, { target: { value: 'newpassword' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'newpassword' } });
        fireEvent.change(firstNameField, { target: { value: 'John' } });
        fireEvent.change(lastNameField, { target: { value: 'Doe' } });
        fireEvent.change(otherNamesField, { target: { value: 'Middle' } });
        fireEvent.change(phoneField, { target: { value: '1234567890' } });

        const submitButton = screen.getByTestId("submit-button");
        fireEvent.click(submitButton);

        await waitFor(() =>
            expect(AxiosInstance.delete).toHaveBeenCalled()
        );

    });
});