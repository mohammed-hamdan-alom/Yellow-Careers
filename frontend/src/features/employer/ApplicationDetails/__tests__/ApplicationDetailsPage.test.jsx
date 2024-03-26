import React from "react";
import { render, screen, fireEvent, act, cleanup, within } from "@testing-library/react";
import ApplicationDetailsPage from "../ApplicationDetailsPage";
import { vi } from "vitest";
import { BrowserRouter as Router, Route, Routes, MemoryRouter } from "react-router-dom";
import AuthContext from "@/context/AuthContext";

const job_seeker1 = {
  user: {
    user_type: "job_seeker",
    user_id: 1,
  },
};

const jobSeeker = {
  first_name: "John",
  last_name: "Doe",
  dob: "1990-01-01",
  nationality: "British",
  sex: "Male",
  address: {
    city: "New York",
    post_code: "NY12345",
    country: "USA",
  },
};
const employer = {
  user_type: "employer",
  email: "johndoe@example.com",
  first_name: "John",
  last_name: "Doe",
  other_names: "Charles",
  phone_number: "08012345678",
  user_id: "123456789",
};
const data = {
  application: {
    id: 1,
    date_applied: "2024-03-18",
    status: "U",
    decision: "U",
    job: 1,
    resume_id: 1,
    job_seeker: 1,
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
      if (url == `/api/applications/1`) {
        return Promise.resolve({ data: data.application });
      } else if (url == `/api/applications/1/resume`) {
        return Promise.resolve({ data: data.resume });
      } else if (url == `/api/jobs/1/questions`) {
        return Promise.resolve({ data: data.questions });
      } else if (url == `/api/job-seekers/1`) {
        return Promise.resolve({ data: jobSeeker });
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

describe("ApplicationDetails component with questions", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={employer}>
            <ApplicationDetailsPage />
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
    const questionAndAnswerLabel = screen.getByText("Questions and Answers:");
    expect(questionAndAnswerLabel).toBeInTheDocument();
  });

  test("render application info correctly", async () => {
    const jobSeekerName = `${jobSeeker.first_name} ${jobSeeker.last_name}`;
    // const dob = data.application.dob;
    // const nationality = data.application.nationality;
    // const sex = data.application.sex;
    // const city = data.application.address.city;
    // const postCode = data.application.address.post_code;
    // const country = data.application.address.country;

    const jobSeekerElement = screen.getByText(`Job Seeker: ${jobSeekerName}`);
    // const dobElement = screen.getByText(`Date of Birth: ${dob}`);
    // const nationalityElement = screen.getByText(`Nationality: ${nationality}`);
    // const sexElement = screen.getByText(`Sex: ${sex}`);
    // const cityElement = screen.getByText(`City: ${city}`);
    // const postCodeElement = screen.getByText(`Post Code: ${postCode}`);
    // const countryElement = screen.getByText(`Country: ${country}`);
    // const resumeElement = screen.getByTestId("mock-resume");
    // const questionsAndAnswersElement = screen.getByTestId("mock-questionsandanswers");

    expect(jobSeekerElement).toBeInTheDocument();
    // expect(dobElement).toBeInTheDocument();
    // expect(nationalityElement).toBeInTheDocument();
    // expect(sexElement).toBeInTheDocument();
    // expect(cityElement).toBeInTheDocument();
    // expect(postCodeElement).toBeInTheDocument();
    // expect(countryElement).toBeInTheDocument();
    // expect(resumeElement).toBeInTheDocument();
    // expect(questionsAndAnswersElement).toBeInTheDocument();
  });
});
