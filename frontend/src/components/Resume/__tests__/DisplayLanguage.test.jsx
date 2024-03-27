// FILEPATH: /Users/hamdanalom/Desktop/Yellow-Careers/frontend/src/components/Resume/__tests__/DisplayLanguages.test.jsx

import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest'
import AxiosInstance from '@/utils/AxiosInstance';
import DisplayLanguages from '../DisplayLanguages';

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  },
}));

describe('DisplayLanguages', () => {
  const mockData = [
    {
      language: 'English',
      spoken_proficiency: 'Fluent',
      written_proficiency: 'Fluent'
    },
    {
      language: 'Spanish',
      spoken_proficiency: 'Intermediate',
      written_proficiency: 'Intermediate'
    }
  ];

  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: mockData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display languages', async () => {
    render(<DisplayLanguages resumeId="1" />);

    await waitFor(() => expect(AxiosInstance.get).toHaveBeenCalledTimes(1));
    expect(AxiosInstance.get).toHaveBeenCalledWith('api/resumes/1/languages/');

    for (const language of mockData) {
      const languageString = `${language.language}`;
      expect(await screen.findAllByText(`Language:`)).toBeVisible();
      expect(await screen.findByText(languageString)).toBeInTheDocument();
      expect(await screen.findByText(`Spoken proficiency: ${language.spoken_proficiency}`)).toBeInTheDocument();
      expect(await screen.findByText(`Written proficiency: ${language.written_proficiency}`)).toBeVisible();
    }
  });

  it('should not fetch languages if resumeId is not provided', async () => {
    render(<DisplayLanguages />);

    await waitFor(() => expect(AxiosInstance.get).not.toHaveBeenCalled());
  });

  it('should handle fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    AxiosInstance.get.mockRejectedValue(new Error('Fetch error'));

    render(<DisplayLanguages resumeId="1" />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error:', new Error('Fetch error')));
    consoleSpy.mockRestore();
  });
});