import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import JobCreationPage from "../JobCreationPage";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";

const jobData = {
  id: 1,
};

const ejrData = {
  employer: 1,
  job: 1,
};

const emptyJob = {
  address: {
    city: "",
    country: "",
    post_code: "",
  },
  description: "",
  job_type: "FT",
  salary: 0,
  title: "",
};

const updatedJob = {
  address: {
    city: "CITY",
    country: "COUNTRY",
    post_code: "POSTCODE",
  },
  description: "DESCRIPTION",
  job_type: "FT",
  salary: 1234,
  title: "TITLE",
};

const employer = {
  user: {
    user_id: 1,
  },
};

const navigate = vi.fn();

vi.mock("@/components/ui/label", () => ({
  Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>),
}));

vi.mock("@/components/ui/input", () => ({
  Input: vi.fn(() => <input data-testid="mock-input"></input>),
}));

vi.mock("@/features/employer/JobCreation/QuestionCreationPage", () => ({
  default: vi.fn(() => <div data-testid="mock-questioncreation"></div>),
}));

vi.mock("antd", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Modal: ({ children }) => <div data-testid="mock-modal">{children}</div>,
  };
});

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
    post: vi.fn((url) => {
      if (url == "api/jobs/create-job") {
        return Promise.resolve({ data: jobData });
      } else {
        return Promise.resolve({ data: jobData });
      }
    }),
  },
}));

vi.mock("@/context/AuthContext", () => ({
  __esModule: true,
  default: React.createContext(),
}));

describe("JobCreation component", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={employer}>
            <JobCreationPage />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(cleanup);

  test("renders all Labels and Modal correctly", async () => {
    const labels = await screen.getAllByTestId("mock-label");
    expect(labels).toHaveLength(7);
    expect(labels[0]).toHaveTextContent("Job Title");
    expect(labels[1]).toHaveTextContent("Job Description");
    expect(labels[2]).toHaveTextContent("Salary");
    expect(labels[3]).toHaveTextContent("Postcode");
    expect(labels[4]).toHaveTextContent("City");
    expect(labels[5]).toHaveTextContent("Country");
    expect(labels[6]).toHaveTextContent("Job Type");
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });

  test("renders all form fields correctly", async () => {
    const titleInput = await document.querySelector("input[name='title']");
    const descriptionInput = await document.querySelector("textarea[name='description']");
    const salaryInput = await document.querySelector("input[name='salary']");
    const postCodeInput = await document.querySelector("input[name='post_code']");
    const cityInput = await document.querySelector("input[name='city']");
    const countryInput = await document.querySelector("input[name='country']");
    const jobTypeInput = await (await screen.findByTestId("job_type")).querySelector("input");
    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(salaryInput).toBeInTheDocument();
    expect(postCodeInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(countryInput).toBeInTheDocument();
    expect(jobTypeInput).toBeInTheDocument();
  });

  test("submit button renders and submits", async () => {
    const submitButton = await screen.getByRole("button", { name: "Create Job" });
    expect(submitButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(AxiosInstance.post).toHaveBeenCalledWith("api/jobs/create-job", emptyJob);
    expect(AxiosInstance.post).toHaveBeenCalledWith("api/employer-job-relations/create/", ejrData);
  });

  test("form fields update and submit correctly", async () => {
    const titleInput = await document.querySelector("input[name='title']");
    const descriptionInput = await document.querySelector("textarea[name='description']");
    const salaryInput = await document.querySelector("input[name='salary']");
    const postCodeInput = await document.querySelector("input[name='post_code']");
    const cityInput = await document.querySelector("input[name='city']");
    const countryInput = await document.querySelector("input[name='country']");
    const jobTypeInput = await (await screen.findByTestId("job_type")).querySelector("input");
    const submitButton = await screen.getByRole("button", { name: "Create Job" });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "TITLE" } });
      fireEvent.change(descriptionInput, { target: { value: "DESCRIPTION" } });
      fireEvent.change(salaryInput, { target: { value: 1234 } });
      fireEvent.change(postCodeInput, { target: { value: "POSTCODE" } });
      fireEvent.change(cityInput, { target: { value: "CITY" } });
      fireEvent.change(countryInput, { target: { value: "COUNTRY" } });
      fireEvent.change(jobTypeInput, { target: { value: "IN" } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(AxiosInstance.post).toHaveBeenCalledWith("api/jobs/create-job", updatedJob);
    expect(AxiosInstance.post).toHaveBeenCalledWith("api/employer-job-relations/create/", ejrData);
    expect(screen.getByTestId("mock-questioncreation")).toBeInTheDocument();
  });
});
