import React from "react";
import { render, waitFor, act, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest'
import AxiosInstance from "@/utils/AxiosInstance";
import DisplayResume from '../DisplayResume';
import DisplaySoftSkills from "@/components/Resume/DisplaySoftSkills";
import DisplayTechnicalSkills from "@/components/Resume/DisplayTechnicalSkills";
import DisplayEducation from "@/components/Resume/DisplayEducation";
import DisplayLanguages from "@/components/Resume/DisplayLanguages";
import DisplayProfessionalExperience from "@/components/Resume/DisplayProfessionalExperience";
import { Label } from "@/components/ui/label";

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  },
}));

vi.mock("@/components/Resume/DisplaySoftSkills", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-displaysoftskills"></div>),
  };
});

vi.mock("@/components/Resume/DisplayTechnicalSkills", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-displaytechnicalskills"></div>),
  };
});

vi.mock("@/components/Resume/DisplayEducation", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-displayeducation"></div>),
  };
});

vi.mock("@/components/Resume/DisplayLanguages", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-displaylanguages"></div>),
  };
});

vi.mock("@/components/Resume/DisplayProfessionalExperience", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-displayprofessionalexperience"></div>),
  };
});

describe('DisplayResume', () => {
  const mockResumeData = {
    about: 'About me text',
    experience: 'Professional experience text',
    website: 'https://example.com',
    linkedin: 'https://linkedin.com',
  };

  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: mockResumeData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display resume data and nested components', async () => {
    const resumeId = '1';
    await act(async () => {
      render(<DisplayResume resumeId={resumeId} />);
    })

    await waitFor(() => expect(AxiosInstance.get).toHaveBeenCalled());
    expect(AxiosInstance.get).toHaveBeenCalledWith(`api/resumes/${resumeId}/`);

    // Check if about text is displayed
    expect(await screen.findByText('About:')).toBeInTheDocument();
    expect(await screen.findByText(mockResumeData.about)).toBeInTheDocument();

    // Check if experience text is displayed
    expect(await screen.findByText('Experience:')).toBeInTheDocument();
    expect(await screen.findByText(mockResumeData.experience)).toBeInTheDocument();

    // Check if website link is displayed
    const websiteLink = screen.getByText(mockResumeData.website);
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('href', mockResumeData.website);

    // Check if LinkedIn link is displayed
    const linkedinLink = screen.getByText(mockResumeData.linkedin);
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', mockResumeData.linkedin);

    // Check if nested components are rendered
    expect(await screen.findByTestId("mock-displaysoftskills")).toBeInTheDocument();
    expect(await screen.findByTestId("mock-displaytechnicalskills")).toBeInTheDocument();
    expect(await screen.findByTestId("mock-displayeducation")).toBeInTheDocument();
    expect(await screen.findByTestId("mock-displaylanguages")).toBeInTheDocument();
    expect(await screen.findByTestId("mock-displayprofessionalexperience")).toBeInTheDocument();

  });

  it('should not fetch resume data if resumeId is not provided', async () => {
    render(<DisplayResume />);

    await waitFor(() => expect(AxiosInstance.get).not.toHaveBeenCalled());
  });

  it('should handle fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    AxiosInstance.get.mockRejectedValue(new Error('Fetch error'));

    render(<DisplayResume resumeId="1" />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error:', new Error('Fetch error')));
    consoleSpy.mockRestore();
  });
});
