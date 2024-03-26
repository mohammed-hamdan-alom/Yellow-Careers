import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AxiosInstance from "@/utils/AxiosInstance";
import AuthContext from "@/context/AuthContext";
import AppliedJobDetails from "../applied-job-details/AppliedJobDetails";

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
  answers: [
    {
      id: 3,
      answer: "Aperiam harum ea laboriosam dolorum eum.",
      application: 3,
      question: 1,
    },
    {
      id: 4,
      answer:
        "Dolorum quo libero similique alias maxime. Harum deleniti officia nisi iure veritatis laborum.",
      application: 3,
      question: 2,
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
      applicationId: 1,
    }),
  };
});

vi.mock("@/components/QuestionsAndAnswers/QuestionsAndAnswers", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-questionsandanswers"></div>),
  };
});

vi.mock("@/components/Resume/DisplayResume", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-resume"></div>),
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
      if (url == `api/applications/1`) {
        return Promise.resolve({ data: data.application });
      } else if (url == `/api/applications/1/resume`) {
        return Promise.resolve({ data: data.resume });
      } else if (url == `/api/jobs/1/questions`) {
        return Promise.resolve({ data: data.questions });
      } else {
        return Promise.resolve({ data: data.answers });
      }
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

describe("AppliedJobDetailsPage component with questions", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={job_seeker1}>
            <AppliedJobDetails />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(async () => {
    cleanup;
  });

  test("render DisplayResume component", async () => {
    const resume = screen.getByTestId("mock-resume");
    expect(resume).toBeInTheDocument();
  });

  test("render QuestionAndAnswers component", async () => {
    const questionsAndAnswers = await screen.findByTestId("mock-questionsandanswers");
    expect(questionsAndAnswers).toBeInTheDocument();
  });

  test("render application info correctly", async () => {
    const dateAndStatusLabel = screen.getAllByTestId("mock-label")[0];
    const questionAndAnswerLabel = screen.getByText("Questions and Answers:");

    expect(dateAndStatusLabel).toHaveTextContent("Date Applied: 2024-03-18 | Status: Undecided");
    expect(questionAndAnswerLabel).toBeInTheDocument();
  });
});

describe("AppliedJobDetailsPage component without questions", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.spyOn(AxiosInstance, "get").mockImplementation(() => {
      return Promise.resolve({ data: data.application });
    });
    vi.spyOn(AxiosInstance, "get").mockImplementationOnce(() => {
      return Promise.resolve({ data: data.resume });
    });
    vi.spyOn(AxiosInstance, "get").mockImplementationOnce(() => {
      return Promise.resolve({ data: [] });
    });
    vi.spyOn(AxiosInstance, "get").mockImplementationOnce(() => {
      return Promise.resolve({ data: [] });
    });
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={job_seeker1}>
            <AppliedJobDetails />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  test("render application info correctly for no questions", async () => {
    const questionAndAnswerLabel = screen.queryByText("Questions and Answers:");

    expect(questionAndAnswerLabel).toBeNull();
  });
});
