import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import AxiosInstance from '@/utils/AxiosInstance';
import DisplayProfessionalExperience from '../DisplayProfessionalExperience';
import { act } from 'react-dom/test-utils';

vi.mock('@/utils/AxiosInstance', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  },
}));

describe('DisplayProfessionalExperience', () => {
  const mockData = [
    {
      position: 'Software Engineer',
      start_date: '2020-01-01',
      end_date: '2021-01-01',
      company: 'Company A',
      address: {
        post_code: '12345',
        city: 'City A',
        country: 'Country A',
      },
    },
    {
      position: 'Senior Software Engineer',
      start_date: '2021-01-01',
      end_date: '2022-01-01',
      company: 'Company B',
      address: {
        post_code: '67890',
        city: 'City B',
        country: 'Country B',
      },
    },
  ];

  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: mockData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display professional experiences', async () => {
    await act(async () => {
      render(<DisplayProfessionalExperience resumeId="1" />);
    });

    expect(AxiosInstance.get).toHaveBeenCalledWith('api/resumes/1/professional-experiences/');

    mockData.forEach(async (experience, index) => {
      expect(await screen.getAllByText(experience.position)).to.not.be.null;
      expect(await screen.getAllByText(experience.start_date)).to.not.be.null;
      expect(await screen.getAllByText(experience.end_date)).to.not.be.null;
      expect(await screen.getAllByText(experience.company)).to.not.be.null;
      expect(await screen.getAllByText(`Location: ${experience.address.post_code}, ${experience.address.city}, ${experience.address.country}`)).to.not.be.null;;
      if (index < mockData.length - 1) {
        expect(screen.getByTestId(`divider-${index}`)).to.not.be.null;
      }
    });
  });

  it('should not fetch professional experiences if resumeId is not provided', async () => {
    await act(async () => {
      render(<DisplayProfessionalExperience />);
    });

    expect(AxiosInstance.get).not.toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    AxiosInstance.get.mockRejectedValue(new Error('Fetch error'));

    await act(async () => {
      render(<DisplayProfessionalExperience resumeId="1" />);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', new Error('Fetch error'));

    consoleErrorSpy.mockRestore();
  });
});