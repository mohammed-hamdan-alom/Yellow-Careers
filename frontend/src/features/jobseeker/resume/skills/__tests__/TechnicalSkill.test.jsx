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
      expect(AxiosInstance.get).toHaveBeenCalledWith(`api/resumes/${resumeId}/technical-skills/`)
    );
  });

  it("adds a technical skill", async () => {
    render(<TechnicalSkill resumeId={resumeId} />);
    const inputField = screen.findByRole("textbox", { name: /Add technical skill:/ });
    fireEvent.change(inputField, { target: { value: "React" }});

    const addButton = screen.getByRole("button", { name: /Add/ });
    fireEvent.click(addButton);
    await waitFor(() =>
      expect(AxiosInstance.post).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/technical-skills/create/`,
        { skill: "React" }
      )
    );
  });
});