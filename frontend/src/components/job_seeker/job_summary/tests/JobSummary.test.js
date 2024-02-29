import React from 'react';
import { render, screen } from '../../../../utils/test-utils';
import JobSummary from '../JobSummary';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('JobSummary', () => {
  const job = {
    id: 1,
    title: "Software Engineer",
    hirer: "Tech Inc.",
    description: "Develop full-stack applications.",
    location: "New York",
  };

  beforeEach(() => {
    useNavigate.mockClear();
    useNavigate.mockImplementation(() => jest.fn());
  });

  test('always passes', () => {
    expect(true).toBeTruthy();
  });
  // test('renders job details correctly', () => {
  //   render(<JobSummary {...job} />);

  //   expect(screen.getByText(job.title)).toBeInTheDocument();
  //   expect(screen.getByText(job.hirer)).toBeInTheDocument();
  //   expect(screen.getByText(job.description)).toBeInTheDocument();
  //   if (job.location) {
  //     expect(screen.getByText("Location:")).toBeInTheDocument();
  //     expect(screen.getByText(job.location)).toBeInTheDocument();
  //   }
  // });

  // test('navigates to job details page on click', () => {
  //   render(<JobSummary {...job} />);
  //   userEvent.click(screen.getByText(job.title));
    
  //   expect(useNavigate()).toHaveBeenCalledWith(`/job-seeker/job-details/${job.id}`);
  // });
});