import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import AxiosInstance from '@/utils/AxiosInstance';
import SoftSkill from '../SoftSkill';

vi.mock('@/utils/AxiosInstance', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('SoftSkill Component', () => {
  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: [] });
    AxiosInstance.post.mockResolvedValue({ data: { id: '123', skill: 'Communication' } });
    AxiosInstance.delete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('fetches soft skills on mount', async () => {
    const resumeId = 'sampleResumeId';
    render(<SoftSkill resumeId={resumeId} />);

    await waitFor(() =>
      expect(AxiosInstance.get).toHaveBeenCalledWith(`api/resumes/${resumeId}/soft-skills/`)
    );
  });

  test('adds a soft skill', async () => {
    const resumeId = 'sampleResumeId';
    render(<SoftSkill resumeId={resumeId} />);

    const inputField = screen.getByRole('textbox', { name: /Add soft skill:/ });
    fireEvent.change(inputField, { target: { value: 'Communication' } });

    const addButton = screen.getByRole('button', { name: /Add/ });
    fireEvent.click(addButton);

    await waitFor(() =>
      expect(AxiosInstance.post).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/soft-skills/create/`,
        { skill: 'Communication' }
      )
    );
  });

  test('deletes a soft skill', async () => {
    const resumeId = 'sampleResumeId';
    render(<SoftSkill resumeId={resumeId} />);

    const mockSoftSkill = { id: '123', skill: 'Communication' };

    AxiosInstance.get.mockResolvedValueOnce({ data: [mockSoftSkill] });

    const deleteButton = await screen.findByTestId('delete-soft-skill');
    await act(async () => fireEvent.click(deleteButton));

    await waitFor(() =>
      expect(AxiosInstance.delete).toHaveBeenCalledWith(
        `api/resumes/${resumeId}/soft-skills/update/${mockSoftSkill.id}`
      )
    );
  });

  // Add more tests to cover edge cases and error handling if needed
});
