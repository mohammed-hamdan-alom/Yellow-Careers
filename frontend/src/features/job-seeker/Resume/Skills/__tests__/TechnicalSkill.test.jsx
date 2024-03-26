import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import AxiosInstance from "@/utils/AxiosInstance";
import TechnicalSkill from "../TechnicalSkill";

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const resumeId = "sampleResumeId";
const mockTechnicalSkill = { id: "123", skill: "React" };

describe("TechnicalSkill Component", () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: [] });
    AxiosInstance.post.mockResolvedValue({ data: mockTechnicalSkill });
    AxiosInstance.delete.mockResolvedValue({});
  });

  it("fetches technical skills on mount", async () => {
    render(<TechnicalSkill resumeId={resumeId} />);
    await waitFor(() =>
      expect(AxiosInstance.get).toHaveBeenCalledWith(`api/resumes/${resumeId}/technical-skills/`),
    );
  });

  it("adds a technical skill", async () => {
    render(<TechnicalSkill resumeId={resumeId} />);
    const inputField = document.querySelector("input[name='technicalSkill']");
    fireEvent.change(inputField, { target: { value: "React" } });

    const addButton = screen.getByTestId("add-technical-skill-button");
    fireEvent.click(addButton);
    await waitFor(() =>
      expect(AxiosInstance.post).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/technical-skills/create/`,
        { skill: "React" },
      ),
    );
  });

  it("deletes a technical skill", async () => {
    const resumeId = "sampleResumeId";
    const mockTechnicalSkill = { id: "123", skill: "Expert" };
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockTechnicalSkill] });

    render(<TechnicalSkill resumeId={resumeId} />);



    const deleteButton = await screen.findByTestId("delete-technical-skill");
    await act(async () => fireEvent.click(deleteButton));

    await waitFor(() =>
      expect(AxiosInstance.delete).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/technical-skills/update/${mockTechnicalSkill.id}`,
      ),
    );
  });
});
