import { render, screen, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest'
import AxiosInstance from '@/utils/AxiosInstance';
import DisplayEducation from '../DisplayEducation';

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  },
}));

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
    vi.clearAllMocks();
  });

  it('should fetch and display educations', async () => {
    await act(async () => {
      render(<DisplayEducation resumeId="1" />);
    })


    await waitFor(() => expect(AxiosInstance.get).toHaveBeenCalledTimes(1));
    expect(AxiosInstance.get).toHaveBeenCalledWith('api/resumes/1/educations/');

    //Check display for first course
    const courseNameString = `${mockData[0].course_name}`;
    expect(await screen.findByText(courseNameString)).toBeVisible();
    const startDate = await screen.getAllByTestId("start-date")[0]
    const endDate = await screen.getAllByTestId("end-date")[0]
    const level = await screen.getAllByTestId("level")[0]
    const institution = await screen.getAllByTestId("institution")[0]
    const grade = await screen.getAllByTestId("grade")[0]
    const location = await screen.getAllByTestId("location")[0]

    expect(startDate).toHaveTextContent(`Start Date: ${mockData[0].start_date}`);
    expect(endDate).toHaveTextContent(`End Date: ${mockData[0].end_date}`)

  });

  it('should not fetch educations if resumeId is not provided', async () => {
    render(<DisplayEducation />);

    await waitFor(() => expect(AxiosInstance.get).not.toHaveBeenCalled());
  });

  it('should handle fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    AxiosInstance.get.mockRejectedValue(new Error('Fetch error'));

    render(<DisplayEducation resumeId="1" />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error:', new Error('Fetch error')));
    consoleSpy.mockRestore();
  });
});