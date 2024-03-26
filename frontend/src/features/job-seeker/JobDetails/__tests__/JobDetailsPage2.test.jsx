import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AxiosInstance from "@/utils/AxiosInstance";
import JobDetails from "@/components/JobDetails/JobDetails";
import AuthContext from "@/context/AuthContext";

Object.defineProperty(window, "location", {
  configurable: true,
  value: { reload: vi.fn() },
});

const data2 = {
  job: {
    id: 1,
    title: "Administrator, local government",
    description:
      "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
    address: {
      post_code: "POSTCODE",
      city: "CITY",
      country: "COUNTRY",
    },
    job_type: "FT",
    salary: 44976,
    company: {
      id: 1,
      company_name: "The Company",
      website: "http://www.morris-murphy.org/",
      about: "This is a Company",
    },
  },
  questions: [],
  resume: {
    id: 1,
  },
  applied_jobs: [],
  saved_jobs: [{ id: 2 }],
};

const job_seeker2 = {
  user: {
    user_type: "job_seeker",
    user_id: 2,
  },
};

const navigate = vi.fn();

vi.mock("@/components/JobDetails/JobDetails", () => ({
  default: vi.fn(() => <div data-testid="mock-jobdetails"></div>),
}));

vi.mock("@/components/ui/label", () => ({
  Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>),
}));

vi.mock("@/components/ui/button", () => ({
  Button: vi.fn(({ children }) => <button data-testid="mock-button">{children}</button>),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigate,
    useParams: () => ({
      jobId: 1,
    }),
  };
});

vi.mock("@/context/AuthContext", () => ({
  __esModule: true,
  default: React.createContext(),
}));

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn((url) => {
      if (url == "api/jobs/2/") {
        return Promise.resolve({ data: data2.job });
      } else if (url == `api/jobs/2/company/`) {
        return Promise.resolve({ data: data2.job.company });
      } else if (url == `api/jobs/2/address/`) {
        return Promise.resolve({ data: data2.job.address });
      } else if (url == `api/jobs/2/questions/`) {
        return Promise.resolve({ data: data2.questions });
      } else if (url == `api/job-seeker/2/resume/`) {
        return Promise.resolve({ data: data2.resume });
      } else if (url == `api/job-seeker/2/applied-jobs/`) {
        return Promise.resolve({ data: data2.applied_jobs });
      } else if (url == `api/job-seeker/2/saved-jobs/`) {
        return Promise.resolve({ data: data2.saved_jobs });
      }
      return Promise.resolve({ data: {} });
    }),
    delete: vi.fn(() => {
      return Promise.resolve({});
    }),
    then: vi.fn(() => {}),
    post: vi.fn(() => {
      return Promise.resolve({});
    }),
  },
}));

describe("JobDetailsPage component without questions", async () => {
  beforeEach(async () => {
    vi.mock("react-router-dom", async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useNavigate: () => navigate,
        useParams: () => ({
          jobId: 2,
        }),
      };
    });
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={job_seeker2}>
            <JobDetails />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(cleanup);

  test("renders apply and unsave buttons correctly", async () => {
    const applyButton = await screen.findByText("Apply");
    const saveButton = await screen.findByText("Unsave");

    expect(applyButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  test("unsave button functions correctly", async () => {
    const saveButton = await screen.findByText("Unsave");

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(AxiosInstance.delete).toBeCalledWith(`api/saved-jobs/update/2/2/`);
  });

  test("apply button leads to no questions prompt and functions correctly", async () => {
    const applyButton = await screen.findByText("Apply");

    await act(async () => {
      fireEvent.click(applyButton);
    });

    const titleText = await screen.getByText("Are you sure?");
    const descriptionText = await screen.getByText("Are you sure?");
    const cancelButton = await screen.getByText("Are you sure?");
    const confirmationButton = await screen.getByText("Yes, apply!");
    expect(confirmationButton).toBeInTheDocument();
    expect(titleText).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(confirmationButton);
    });

    expect(AxiosInstance.post).toBeCalledWith("api/applications/create/", {
      job: 2,
      job_seeker: 2,
      resume: 1,
    });
  });
});
