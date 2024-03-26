import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import AxiosInstance from "@/utils/AxiosInstance";
import EditEducationPage from "../EditEducationPage";

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

describe("EditEducationPage Component", () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("fetches education details on mount", async () => {
    const educationId = "sampleEducationId";
    render(<EditEducationPage put resumeId="sampleResumeId" educationId={educationId} />);
    await waitFor(() =>
      expect(AxiosInstance.get).toHaveBeenCalledWith(
        `api/resumes/sampleResumeId/educations/update/sampleEducationId`,
      ),
    );
  });

  test("updates education on submit", async () => {
    const educationId = "sampleEducationId";
    render(<EditEducationPage put resumeId="sampleResumeId" educationId={educationId} />);
    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(AxiosInstance.put).toHaveBeenCalledWith(
        `api/resumes/sampleResumeId/educations/update/sampleEducationId`,
        expect.any(Object),
      ),
    );
  });

  test("creates education on submit", async () => {
    render(<EditEducationPage post resumeId="sampleResumeId" />);
    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(AxiosInstance.post).toHaveBeenCalledWith(
        `api/resumes/sampleResumeId/educations/create/`,
        expect.any(Object),
      ),
    );
  });
});
