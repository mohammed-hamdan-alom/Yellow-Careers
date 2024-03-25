import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import AxiosInstance from '@/utils/AxiosInstance';
import Education from '../Education';
import { act } from 'react-dom/test-utils';

vi.mock('@/utils/AxiosInstance', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Education Component', () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('fetches educations on mount', async () => {
    const resumeId = 'sampleResumeId';
    render(<Education resumeId={resumeId} />);
    await waitFor(() => expect(AxiosInstance.get).toHaveBeenCalledWith(`api/resumes/${resumeId}/educations/`));
  });

  test('deletes education when delete button is clicked', async () => {
    const educations = [
      {
        id: 1,
        course_name: 'Computer Science',
        institution: 'Sample University',
        level: 'Bachelor',
        grade: 'A',
      },
    ];
    AxiosInstance.get.mockResolvedValue({ data: educations });

    const { getByText } = render(<Education resumeId="sampleResumeId" />);
    const deleteButton = await screen.findByText('Delete');

    fireEvent.click(deleteButton);

    await waitFor(() => expect(AxiosInstance.delete).toHaveBeenCalled());
  });
});
