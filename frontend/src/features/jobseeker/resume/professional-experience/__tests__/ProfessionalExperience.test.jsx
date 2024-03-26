import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import AxiosInstance from "@/utils/AxiosInstance";
import ProfessionalExperience from "../ProfessionalExperience";

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ProfessionalExperience Component", () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("fetches professional experiences on mount", async () => {
    const resumeId = "sampleResumeId";
    render(<ProfessionalExperience resumeId={resumeId} />);
    await waitFor(() =>
      expect(AxiosInstance.get).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/professional-experiences/`,
      ),
    );
  });

  test("deletes professional experience when delete button is clicked", async () => {
    const resumeId = "sampleResumeId";
    const professionalExperience = {
      id: "sampleExperienceId",
      position: "Software Engineer",
      company: "XYZ Corp",
    };
    AxiosInstance.get.mockResolvedValue({ data: [professionalExperience] });

    render(<ProfessionalExperience resumeId={resumeId} />);
    const deleteButton = await screen.findByRole("button", { name: /Delete/ });

    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(AxiosInstance.delete).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/professional-experiences/update/sampleExperienceId`,
      ),
    );
  });
});
