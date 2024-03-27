import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest'
import AxiosInstance from "@/utils/AxiosInstance";
import DisplaySoftSkills from '../DisplaySoftSkills';

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  },
}));

describe('DisplaySoftSkills', () => {
  const mockSkills = [
    { skill: 'Communication' },
    { skill: 'Teamwork' },
    { skill: 'Problem Solving' }
  ];

  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: mockSkills });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display soft skills', async () => {
    render(<DisplaySoftSkills resumeId="1" />);

    await waitFor(() => expect(AxiosInstance.get).toHaveBeenCalledTimes(1));
    expect(AxiosInstance.get).toHaveBeenCalledWith('api/resumes/1/soft-skills/');

    for (const skill of mockSkills) {
      expect(await screen.findByText(skill.skill)).toBeInTheDocument();
    }
  });

  it('should not fetch soft skills if resumeId is not provided', async () => {
    render(<DisplaySoftSkills />);

    await waitFor(() => expect(AxiosInstance.get).not.toHaveBeenCalled());
  });

  it('should handle fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    AxiosInstance.get.mockRejectedValue(new Error('Fetch error'));

    render(<DisplaySoftSkills resumeId="1" />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error:', new Error('Fetch error')));
    consoleSpy.mockRestore();
  });
});
