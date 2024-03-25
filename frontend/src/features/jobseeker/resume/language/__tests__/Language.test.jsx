import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import AxiosInstance from '@/utils/AxiosInstance';
import Language from '../Language';

vi.mock('@/utils/AxiosInstance', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Language Component', () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('fetches languages on mount', async () => {
    const resumeId = 'sampleResumeId';
    render(<Language resumeId={resumeId} />);
    await waitFor(() => expect(AxiosInstance.get).toHaveBeenCalledWith(`api/resumes/${resumeId}/languages/`));
  });

  test('deletes language when delete button is clicked', async () => {
    const resumeId = 'sampleResumeId';
    const language = { id: 'sampleLanguageId', language: 'English' };
    AxiosInstance.get.mockResolvedValue({ data: [language] });

    render(<Language resumeId={resumeId} />);
    const deleteButton = await screen.findByTestId('delete-button');

    fireEvent.click(deleteButton);

    await waitFor(() => expect(AxiosInstance.delete).toHaveBeenCalledWith(`api/resumes/${resumeId}/languages/update/sampleLanguageId`));
  });

});
