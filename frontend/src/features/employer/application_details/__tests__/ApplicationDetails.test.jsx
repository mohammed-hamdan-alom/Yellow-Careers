import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ApplicationDetails from "../ApplicationDetails";
import { vi } from "vitest";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const mockApplicationId = 1;

const mockApplicationData = {
  id: mockApplicationId,
  status: "R",
  decision: "U",
  job_seeker: 123,
  job: 456,
  date_applied: "2024-01-01",
};

const mockJobSeekerData = {
  first_name: "John",
  last_name: "Doe",
  dob: "1990-01-01",
  nationality: "American",
  sex: "M",
  address: {
    city: "New York",
    post_code: "NY12345",
    country: "USA",
  },
};

const mockResumeData = {
  id: 123,
  github: "https://github.com/test",
  linkedin: "https://linkedin.com/test",
  about: "I am a test developer",
  experience: "I have 5 years of experience",
};

const mockQuestionsData = [
  {
    id: "1",
    question: "Why do you want to work here?",
  },
];

const mockAnswersData = [
  {
    application: mockApplicationId,
    question: "1",
    answer: "Because I have a passion for this job.",
  },
];

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn((url) => {
      switch (url) {
        case `/api/applications/${mockApplicationId}`:
          return Promise.resolve({ data: mockApplicationData });
        case `/api/job-seekers/${mockApplicationData.job_seeker}`:
          return Promise.resolve({ data: mockJobSeekerData });
        case `/api/applications/${mockApplicationId}/resume`:
          return Promise.resolve({ data: mockResumeData });
        case `/api/jobs/${mockApplicationData.job}/questions`:
          return Promise.resolve({ data: mockQuestionsData });
        case `/api/applications/${mockApplicationId}/answers`:
          return Promise.resolve({ data: mockAnswersData });
        default:
          return Promise.reject(new Error("Not found"));
      }
    }),
    put: vi.fn((url, data) => {
      return Promise.resolve({ data: { ...mockApplicationData, ...data } });
    }),
  },
}));

describe("ApplicationDetails component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Routes>
          <Route
            path={`/applications/${mockApplicationId}`}
            element={<ApplicationDetails />}
          />
        </Routes>
      </Router>
    );
  });

  const markAsRead = () => {
    fireEvent.click(screen.getByText(/Mark Application as Read/i));
  };

  const handleDecisionChange = (decision) => {
    fireEvent.change(screen.getByLabelText(/Decision/i), {
      target: { value: decision },
    });
  };

  test("fetches application details on mount", async () => {
    await waitFor(() => {
      expect(screen.getByText(/Application Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Job Seeker: John Doe/i)).toBeInTheDocument();
      // Add assertions for other fetched details
    });
  });

//   test("marks application as read", async () => {
//     markAsRead();

//     await waitFor(() => {
//       expect(
//         screen.getByText(/Mark Application as Unread/i)
//       ).toBeInTheDocument();
//     });
//   });

//   test("updates decision", async () => {
//     handleDecisionChange("A");

//     await waitFor(() => {
//       expect(screen.getByLabelText(/Decision/i)).toHaveValue("A");
//     });
//   });
});
