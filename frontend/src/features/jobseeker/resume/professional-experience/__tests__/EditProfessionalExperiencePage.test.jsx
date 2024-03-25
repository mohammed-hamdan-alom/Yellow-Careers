import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import AxiosInstance from '@/utils/AxiosInstance';
import EditProfessionalExperience from '../EditProfessionalExperiencePage';

vi.mock('@/utils/AxiosInstance', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('EditProfessionalExperience Component', () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: {} });
    AxiosInstance.post.mockResolvedValue({});
    AxiosInstance.put.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('fetches professional experience on mount for edit', async () => {
    const resumeId = 'sampleResumeId';
    const professionalExperienceId = 'sampleProfessionalExperienceId';
    render(
      <EditProfessionalExperience
        put={true}
        post={false}
        resumeId={resumeId}
        professionalExperienceId={professionalExperienceId}
        setProfessionalExperiences={vi.fn()}
        closeAddModal={vi.fn()}
        closeEditModal={vi.fn()}
      />
    );

    await waitFor(() =>
      expect(AxiosInstance.get).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceId}`
      )
    );
  });

  test('submits professional experience for edit', async () => {
    const resumeId = 'sampleResumeId';
    const professionalExperienceId = 'sampleProfessionalExperienceId';
    render(
      <EditProfessionalExperience
        put={true}
        post={false}
        resumeId={resumeId}
        professionalExperienceId={professionalExperienceId}
        setProfessionalExperiences={vi.fn()}
        closeAddModal={vi.fn()}
        closeEditModal={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Submit/ });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(AxiosInstance.put).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceId}`,
        expect.any(Object)
      )
    );
  });

  test('submits professional experience for creation', async () => {
    const resumeId = 'sampleResumeId';
    render(
      <EditProfessionalExperience
        put={false}
        post={true}
        resumeId={resumeId}
        setProfessionalExperiences={vi.fn()}
        closeAddModal={vi.fn()}
        closeEditModal={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Submit/ });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(AxiosInstance.post).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/professional-experiences/create/`,
        expect.any(Object)
      )
    );
  });

  // Add more tests to cover user interactions and error handling if needed
});
