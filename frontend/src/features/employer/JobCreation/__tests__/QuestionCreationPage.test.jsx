import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import QuestionCreationPage from "../QuestionCreationPage";

Object.defineProperty(window, "location", {
  configurable: true,
  value: { reload: vi.fn() },
});

const questionSubmitData = {
  question: "TEST QUESTION",
  job: 1,
};

const predefinedQuestionData = [
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
];

const employer = {
  user: {
    user_id: 1,
  },
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
  };
});

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(() => {
      return Promise.resolve({ data: [] });
    }),
    post: vi.fn((url) => {
      if (url == "api/questions/create/") {
        return Promise.resolve({ data: questionSubmitData });
      } else {
        return Promise.resolve({ data: {} });
      }
    }),
    delete: vi.fn(() => {
      return Promise.resolve({});
    }),
  },
}));

vi.mock("@/context/AuthContext", () => ({
  __esModule: true,
  default: React.createContext(),
}));

describe("QuestionCreation component with no predefined questions", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={employer}>
            <QuestionCreationPage jobId={1} />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(async () => {
    cleanup;
    vi.clearAllMocks();
  });

  test("renders all components correctly with no questions", async () => {
    const addAQuestionLabel = await screen.getByText("Add a question");
    const questionLabel = await screen.getByTestId("mock-label");
    const questionInput = await document.querySelector("input");
    const addQuestionButton = await screen.getByRole("button", { name: "Add Question" });
    const submitButton = await screen.getByRole("button", { name: "Submit" });
    const currentQuestions = await screen.getByText("Current Questions:");
    const noQuestions = await screen.getByText("There are currently no questions");

    expect(addAQuestionLabel).toBeInTheDocument();
    expect(questionLabel).toBeInTheDocument();
    expect(questionLabel).toHaveTextContent("Question");
    expect(questionInput).toBeInTheDocument();
    expect(addQuestionButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(currentQuestions).toBeInTheDocument();
    expect(noQuestions).toBeInTheDocument();
  });

  test("question input changes correctly", async () => {
    const questionInput = await document.querySelector("input");

    await act(async () => {
      fireEvent.change(questionInput, { target: { value: "TEST QUESTION" } });
    });

    expect(questionInput).toHaveValue("TEST QUESTION");
  });

  test("question submits correctly", async () => {
    const submitButton = await screen.getByRole("button", { name: "Add Question" });
    const questionInput = await document.querySelector("input");

    await act(async () => {
      fireEvent.change(questionInput, { target: { value: "TEST QUESTION" } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(AxiosInstance.post).toHaveBeenCalledWith("api/questions/create/", questionSubmitData);
  });

  test("submit button redirects correctly", async () => {
    const submitButton = await screen.getByRole("button", { name: "Submit" });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(navigate).toBeCalledWith(`/employer/job-details/1`);
  });
});

describe("QuestionCreation component with predefined questions", () => {
  beforeEach(async () => {
    vi.spyOn(AxiosInstance, "get").mockImplementationOnce(() => {
      return Promise.resolve({ data: predefinedQuestionData });
    });
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={employer}>
            <QuestionCreationPage />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(cleanup);

  test("renders predefined questions correctly", async () => {
    const currentQuestions = await screen.getByText("Current Questions:");
    const noQuestions = await screen.queryByText("There are currently no questions");
    const question1 = await screen.getByText("Why work here?");
    const question2 = await screen.getByText("What is your strength?");

    expect(currentQuestions).toBeInTheDocument();
    expect(noQuestions).toBeNull();
    expect(question1).toBeInTheDocument();
    expect(question2).toBeInTheDocument();
  });

  test("renders and submits remove button correctly", async () => {
    const removeButtons = await screen.getAllByRole("button", { name: "Remove" });

    expect(removeButtons).toHaveLength(2);

    await act(async () => {
      fireEvent.click(removeButtons[0]);
    });

    expect(AxiosInstance.delete).toHaveBeenCalledWith(`api/questions/1/update/`);
  });
});
