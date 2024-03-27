import { vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import AxiosInstance from "@/utils/AxiosInstance";
import CreateCompanyPage from "../CreateCompanyPage";

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
  },
}));

const navigate = vi.fn();
vi.mock("react-router-dom", () => ({
  __esModule: true,
  useNavigate: () => navigate,
}));

describe("CreateCompany Component", () => {
  beforeEach(() => {
    AxiosInstance.post.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits company information", async () => {
    render(<CreateCompanyPage />);
    const companyNameInputField = await screen.findByLabelText("Company Name");
    const websitInputField = await screen.findByLabelText("Website");
    const aboutInputField = await screen.findByLabelText("About");
    const adminEmailInputField = await screen.findByLabelText("Admin Email");

    fireEvent.change(companyNameInputField, {
      target: { value: "Company Name" },
    });
    fireEvent.change(websitInputField, { target: { value: "Website" } });
    fireEvent.change(aboutInputField, { target: { value: "About" } });
    fireEvent.change(adminEmailInputField, { target: { value: "admin@example.com" } });

    const addButton = await screen.findByTestId("submit-button");

    await act(async () => {
      fireEvent.click(addButton);
    })


    await waitFor(() =>
      expect(AxiosInstance.post).toHaveBeenCalledWith("api/companies/create/", {
        company_name: "Company Name",
        website: "Website",
        about: "About",
      }),
    );
  });
});
