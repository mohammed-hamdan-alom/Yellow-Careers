import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import JobQuestionsPage from "../JobQuestionsPage";
import AxiosInstance from "@/utils/AxiosInstance";

const job_seeker1 = {
  user: {
    user_type: "job_seeker",
    user_id: 1,
  },
};

const data = {
  application: {
    id: 1,
    date_applied: "2024-03-18",
    status: "U",
    decision: "U",
    job_id: 1,
    resume_id: 1,
    job_seeker_id: 1,
  },
  resume: {
    id: 1,
  },
  questions: [
    {
      id: 1,
      question: "Why work here?",
      job: 1,
    },
    {
      id: 2,
      question: "What is your strength?",
      job: 1,
    },
  ],
};

const navigate = vi.fn();

vi.mock("@/components/ui/label", () => ({
  Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>),
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
      if (url == `api/jobs/1/questions/`) {
        return Promise.resolve({ data: data.questions });
      } else if (url == `api/job-seeker/1/resume/`) {
        return Promise.resolve({ data: data.resume });
      } else {
        return Promise.resolve({});
      }
    }),
    delete: vi.fn(() => {
      return Promise.resolve({});
    }),
    then: vi.fn(() => {}),
    post: vi.fn(() => {
      return Promise.resolve({ data: data.application });
    }),
  },
}));

describe("JobQuestions component", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={job_seeker1}>
            <JobQuestionsPage />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(async () => {
    cleanup;
  });

  test("all components render correctly", async () => {
    const questionsText = screen.getByText("Questions");
    const question1 = screen.getByText(data.questions[0].question);
    const question2 = screen.getByText(data.questions[1].question);
    const answerFields = document.querySelectorAll("textarea");

    expect(questionsText).toBeInTheDocument();
    expect(question1).toBeInTheDocument();
    expect(question2).toBeInTheDocument();
    expect(answerFields).toHaveLength(2);
  });

  test("application submits correctly", async () => {
    const answerFields = document.querySelectorAll("textarea");
    const applyButton = screen.getByText("Apply");
    await act(async () => {
      fireEvent.change(answerFields[0], { target: { value: "Cool place" } });
      fireEvent.change(answerFields[1], { target: { value: "Good tests" } });
      fireEvent.click(applyButton);
    });

    const popupTitle = screen.getByText("Are you sure?");
    const popupDescription = screen.getByText("Are you sure you want to apply for this job?");
    const cancelButton = screen.getByText("Cancel");
    const confirmButton = screen.getByText("Yes, apply!");

    expect(popupTitle).toBeInTheDocument();
    expect(popupDescription).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(AxiosInstance.post).toBeCalledWith("api/applications/create/", {
      job: 1,
      job_seeker: 1,
      resume: 1,
    });
    expect(AxiosInstance.post).toBeCalledWith(`api/answers/create/`, {
      answer: "Cool place",
      application: 1,
      question: "1",
    });
    expect(AxiosInstance.post).toBeCalledWith("api/answers/create/", {
      answer: "Good tests",
      application: 1,
      question: "2",
    });

    expect(navigate).toBeCalledWith(`/job-seeker/job-details/1`);
  });
});
