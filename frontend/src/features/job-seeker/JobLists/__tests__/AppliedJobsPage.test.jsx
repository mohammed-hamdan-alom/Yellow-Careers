import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppliedJobsPage from "@/features/job-seeker/JobLists/AppliedJobsPage";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";

const noAppliedJobsData = [];

const noAppliedJobsJobSeeker = {
  user: {
    user_id: 1,
  },
};

const appliedJobsJobSeeker = {
  user: {
    user_id: 2,
  },
};

const appliedJobsData = [
  {
    id: 1,
    title: "Administrator, local government",
    description:
      "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
    address: { country: "France" },
    job_type: "FT",
    salary: 44976,
  },
  {
    id: 2,
    title: "Contracting civil engineer",
    description: "Fugiat adipisci tempore. Consectetur veniam quaerat deleniti assumenda sapiente.",
    address: { country: "France" },
    job_type: "IN",
    salary: 74726,
  },
];

const navigate = vi.fn();

vi.mock("@/components/ui/label", () => ({
  Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn((url) => {
      if (url == `api/job-seeker/1/applied-jobs/`) {
        return Promise.resolve({ data: noAppliedJobsData });
      } else if (url == `api/job-seeker/2/applied-jobs/`) {
        return Promise.resolve({ data: appliedJobsData });
      } else {
        return Promise.resolve({ data: { company_name: "The Company" } }); //For job summary call
      }
    }),
  },
}));

vi.mock("@/context/AuthContext", () => ({
  __esModule: true,
  default: React.createContext(),
}));

describe("AppliedJobsListPage component with no applied jobs", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={noAppliedJobsJobSeeker}>
            <AppliedJobsPage />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(cleanup);

  test("renders no jobs when no applied jobs found", async () => {
    const noJobsFound = screen.getByText("No applied jobs");

    expect(noJobsFound).toBeInTheDocument();
    expect(AxiosInstance.get).toBeCalledWith(`api/job-seeker/1/applied-jobs/`);
  });
});

describe("AppliedJobsListPage component with applied jobs", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={appliedJobsJobSeeker}>
            <AppliedJobsPage />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(cleanup);

  test("renders job list when applied jobs found", async () => {
    const noJobsFound = screen.queryByText("No applied jobs");
    const job1 = screen.getByText("Administrator, local government");
    const job2 = screen.getByText("Contracting civil engineer");

    expect(noJobsFound).toBeNull();
    expect(job1).toBeInTheDocument();
    expect(job2).toBeInTheDocument();
    expect(AxiosInstance.get).toBeCalledWith(`api/job-seeker/2/applied-jobs/`);
  });
});
