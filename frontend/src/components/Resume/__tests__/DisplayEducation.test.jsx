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


    const courseNameString = await screen.getAllByTestId("course-name");
    const startDate = await screen.getAllByTestId("start-date")
    const endDate = await screen.getAllByTestId("end-date")
    const level = await screen.getAllByTestId("level")
    const institution = await screen.getAllByTestId("institution")
    const grade = await screen.getAllByTestId("grade")
    const location = await screen.getAllByTestId("location")


    mockData.forEach(async (education, index) => {
      expect(courseNameString[index]).toHaveTextContent(`${mockData[index].course_name}`)
      expect(startDate[index]).toHaveTextContent(`Start Date: ${mockData[index].start_date}`);
      expect(endDate[index]).toHaveTextContent(`End Date: ${mockData[index].end_date}`);
      expect(level[index]).toHaveTextContent(`Level: ${mockData[index].level}`);
      expect(institution[index]).toHaveTextContent(`Institution: ${mockData[index].institution}`);
      expect(grade[index]).toHaveTextContent(`Grade: ${mockData[index].grade}`);
      expect(location[index]).toHaveTextContent(`Location: ${mockData[index].address.post_code}, ${mockData[index].address.city}, ${mockData[index].address.country}`);

    });

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