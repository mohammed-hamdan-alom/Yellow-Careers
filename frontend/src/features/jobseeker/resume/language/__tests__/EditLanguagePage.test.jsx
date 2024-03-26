import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import AxiosInstance from "@/utils/AxiosInstance";
import EditLanguagePage from "../EditLanguagePage";

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("EditLanguagePage Component", () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: {} });
    AxiosInstance.post.mockResolvedValue({});
    AxiosInstance.put.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("fetches language on mount for edit", async () => {
    const resumeId = "sampleResumeId";
    const languageId = "sampleLanguageId";
    render(
      <EditLanguagePage
        put={true}
        post={false}
        resumeId={resumeId}
        languageId={languageId}
        setLanguages={vi.fn()}
        closeAddModal={vi.fn()}
        closeEditModal={vi.fn()}
      />,
    );

    await waitFor(() =>
      expect(AxiosInstance.get).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/languages/update/${languageId}`,
      ),
    );
  });

  test("submits language for edit", async () => {
    const resumeId = "sampleResumeId";
    const languageId = "sampleLanguageId";
    render(
      <EditLanguagePage
        put={true}
        post={false}
        resumeId={resumeId}
        languageId={languageId}
        setLanguages={vi.fn()}
        closeAddModal={vi.fn()}
        closeEditModal={vi.fn()}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /Submit/ });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(AxiosInstance.put).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/languages/update/${languageId}`,
        expect.any(Object),
      ),
    );
  });

  test("submits language for creation", async () => {
    const resumeId = "sampleResumeId";
    render(
      <EditLanguagePage
        put={false}
        post={true}
        resumeId={resumeId}
        setLanguages={vi.fn()}
        closeAddModal={vi.fn()}
        closeEditModal={vi.fn()}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /Submit/ });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(AxiosInstance.post).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/languages/create/`,
        expect.any(Object),
      ),
    );
  });
});
