import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import JobApplicantsPage from "../JobApplicants";

const data = [
  {
    id: 54,
    date_applied: "2024-03-18",
    status: "U",
    decision: "A",
    job_seeker: 27,
    resume: 154,
    job: 7,
  },
  {
    id: 68,
    date_applied: "2024-03-18",
    status: "R",
    decision: "U",
    job_seeker: 60,
    resume: 168,
    job: 7,
  },
];

vi.mock("@/features/employer/JobApplicants/ApplicantSummary", () => ({
  default: vi.fn(({ children }) => <div data-testid="mock-applicationsummary">{children}</div>),
}));

const navigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigate,
    useParams: () => ({
      jobId: 7,
    }),
  };
});

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(() => {
      return Promise.resolve({
        data: data,
      });
    }),
  },
}));

describe("JobApplicants component", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthProvider>
            <JobApplicantsPage />
          </AuthProvider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(cleanup);

  test("renders title", async () => {
    const title = await screen.findByText("Matched applicants");
    expect(title).toBeInTheDocument();
  });

  test("renders correct number of applications", async () => {
    const applications = await screen.getAllByTestId("mock-applicationsummary");
    expect(applications).toHaveLength(2);
  });

  test("renders Job Details button", async () => {
    const button = await screen.findByText("Job Details");
    expect(button).toBeInTheDocument;
  });

  test("Job Details button redirects correctly", async () => {
    const button = await screen.findByText("Job Details");
    await act(async () => {
      fireEvent.click(button);
    });
    expect(navigate).toHaveBeenCalledWith(`/employer/job-details/7`);
  });

  test("Status filter renders and filters correctly", async () => {
    const statusLabel = await screen.getByText("Status Filter:");
    const statusFilter = await screen.getByTestId("status").querySelector("input");
    expect(statusLabel).toBeInTheDocument();
    expect(statusFilter).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(statusFilter, { target: { value: "R" } });
      const read = screen.getByText("Read");

      fireEvent.click(read);
    });

    const applications = await screen.getAllByTestId("mock-applicationsummary");
    expect(applications).toHaveLength(1);
  });

  test("Decision filter renders and filters correctly", async () => {
    const decisionLabel = await screen.getByText("Decision Filter:");
    const decisionFilter = await screen.getByTestId("decision").querySelector("input");
    expect(decisionLabel).toBeInTheDocument();
    expect(decisionFilter).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(decisionFilter, { target: { value: "A" } });
      const accepted = screen.getByText("Accepted");

      fireEvent.click(accepted);
    });

    const applications = await screen.getAllByTestId("mock-applicationsummary");
    expect(applications).toHaveLength(1);
  });
});
