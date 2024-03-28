import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import AxiosInstance from "@/utils/AxiosInstance";
import Education from "../Education";
import { act } from "react-dom/test-utils";

const educations = [
  {
    id: 1,
    course_name: "Computer Science",
    institution: "Sample University",
    level: "Bachelor",
    grade: "A",
    address: {
      post_code: "E6",
      city: "London",
      country: "England"
    }
  },
];

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Education Component", () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: educations });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("fetches educations on mount", async () => {
    const resumeId = "sampleResumeId";
    render(<Education resumeId={resumeId} />);
    await waitFor(() =>
      expect(AxiosInstance.get).toHaveBeenCalledWith(`api/resumes/${resumeId}/educations/`),
    );
  });

  test("deletes education when delete button is clicked", async () => {

    AxiosInstance.get.mockResolvedValue({ data: educations });

    const resumeId = "sampleResumeId";
    await act(async () => {
      render(<Education resumeId={resumeId} />);
    })

    const deleteButton = await screen.getByTestId("delete-button");
    await act(async () => {
      fireEvent.click(deleteButton);
    })

    await waitFor(() => expect(AxiosInstance.delete).toHaveBeenCalled());
  });
});
