import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it } from 'vitest'
import userEvent from '@testing-library/user-event';
import AxiosInstance from 'axios';
import DisplayEducation from '../DisplayEducation';

vi.mock('axios');

describe('DisplayEducation', () => {
  const mockData = [
    {
      course_name: 'Computer Science',
      start_date: '2010-09-01',
      end_date: '2014-06-30',
      level: 'Bachelor',
      institution: 'University of Test',
      grade: 'A',
      address: {
        post_code: '12345',
        city: 'Test City',
        country: 'Test Country'
      }
    },
    {
      course_name: 'Software Engineering',
      start_date: '2014-09-01',
      end_date: '2016-06-30',
      level: 'Master',
      institution: 'University of Test',
      grade: 'A',
      address: {
        post_code: '12345',
        city: 'Test City',
        country: 'Test Country'
      }
    }
  ];

  beforeEach(() => {
    AxiosInstance.get.mockResolvedValue({ data: mockData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display educations', async () => {
    render(<DisplayEducation resumeId="1" />);

    await waitFor(() => expect(AxiosInstance.get).toHaveBeenCalledTimes(1));
    expect(AxiosInstance.get).toHaveBeenCalledWith('api/resumes/1/educations/');

    mockData.forEach((education) => {
      expect(screen.getByText(education.course_name)).toBeInTheDocument();
      expect(screen.getByText(`Start Date: ${education.start_date}`)).toBeInTheDocument();
      expect(screen.getByText(`End Date: ${education.end_date}`)).toBeInTheDocument();
      expect(screen.getByText(`Level: ${education.level}`)).toBeInTheDocument();
      expect(screen.getByText(`Institution: ${education.institution}`)).toBeInTheDocument();
      expect(screen.getByText(`Grade: ${education.grade}`)).toBeInTheDocument();
      expect(screen.getByText(`Location: ${education.address.post_code}, ${education.address.city}, ${education.address.country}`)).toBeInTheDocument();
    });
  });

  it('should not fetch educations if resumeId is not provided', async () => {
    render(<DisplayEducation />);

    await waitFor(() => expect(AxiosInstance.get).not.toHaveBeenCalled());
  });

  it('should handle fetch error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    AxiosInstance.get.mockRejectedValue(new Error('Fetch error'));

    render(<DisplayEducation resumeId="1" />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error:', new Error('Fetch error')));
    consoleSpy.mockRestore();
  });
});