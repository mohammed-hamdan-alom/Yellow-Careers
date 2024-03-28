import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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

const professionalExperience = {
  id: "sampleExperienceId",
  position: "Software Engineer",
  company: "XYZ Corp",
  address: {
    post_code: "E6",
    city: "London",
    country: "England"
  }
};

describe("ProfessionalExperience Component", () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: [professionalExperience] });
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

    AxiosInstance.get.mockResolvedValue({ data: [professionalExperience] });

    await act(async () => {
      render(<ProfessionalExperience resumeId={resumeId} />);
    })

    const deleteButton = await screen.findByRole("button", { name: /Delete/ });
    await act(async () => {
      fireEvent.click(deleteButton);
    })


    await waitFor(() =>
      expect(AxiosInstance.delete).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/professional-experiences/update/sampleExperienceId`,
      ),
    );
  });
});
