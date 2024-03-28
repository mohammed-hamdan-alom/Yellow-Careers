import { render, waitFor, screen } from '@testing-library/react';
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
      const positionLabel = screen.getAllByTestId("positionLabel")
      const start_date = screen.getAllByTestId("start_date")
      const end_date = screen.getAllByTestId("end_date")
      const company = screen.getAllByTestId("company")
      const position = screen.getAllByTestId("position")
      const address = screen.getAllByTestId("address")

      mockData.forEach(async (experience, index) => {
        expect(positionLabel[index]).toHaveTextContent(`${mockData[index].position}`)
        expect(start_date[index]).toHaveTextContent(`${mockData[index].start_date}`)
        expect(end_date[index]).toHaveTextContent(`${mockData[index].end_date}`)
        expect(company[index]).toHaveTextContent(`${mockData[index].company}`)
        expect(position[index]).toHaveTextContent(`${mockData[index].position}`)
        expect(address[index]).toHaveTextContent(`Location: ${experience.address.post_code}, ${experience.address.city}, ${experience.address.country}`)
      });
    });
  });

  it('should not fetch professional experiences if resumeId is not provided', async () => {
    await act(async () => {
      render(<DisplayProfessionalExperience />);
    });

    expect(AxiosInstance.get).not.toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    AxiosInstance.get.mockRejectedValue(new Error('Fetch error'));

    await act(async () => {
      render(<DisplayProfessionalExperience resumeId="1" />);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', new Error('Fetch error'));

    consoleErrorSpy.mockRestore();
  });
});