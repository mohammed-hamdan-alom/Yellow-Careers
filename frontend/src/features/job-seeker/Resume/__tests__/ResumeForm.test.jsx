import { render, screen, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ResumeForm from '../ResumeForm';
import AxiosInstance from '@/utils/AxiosInstance';

vi.mock("@/utils/AxiosInstance", () => ({
  __esModule: true,
  default: {
    put: vi.fn(),
  },
}));

describe('ResumeForm', () => {

  const resumeId = '123';

  it('renders without crashing', () => {
    render(
        <ResumeForm />
    );
  });

  it('updates the form fields on change', () => {
    const { getByLabelText } = render(
        <ResumeForm />
    );

    const websiteInput = screen.getByLabelText('Website:');
    const linkedinInput = screen.getByLabelText('LinkedIn:');
    const aboutInput = screen.getByLabelText('About:');
    const experienceInput = screen.getByLabelText('Experience:');

    fireEvent.change(websiteInput, { target: { value: 'test-website' } });
    fireEvent.change(linkedinInput, { target: { value: 'test-linkedin' } });
    fireEvent.change(aboutInput, { target: { value: 'test-about' } });
    fireEvent.change(experienceInput, { target: { value: 'test-experience' } });

    expect(websiteInput.value).toBe('test-website');
    expect(linkedinInput.value).toBe('test-linkedin');
    expect(aboutInput.value).toBe('test-about');
    expect(experienceInput.value).toBe('test-experience');
  });

  it('submits the form', async () => {
    const { getByLabelText, getByText } = render(
        <ResumeForm />
    );

    const websiteInput = screen.getByLabelText('website:');
    const linkedinInput = screen.getByLabelText('LinkedIn:');
    const aboutInput = screen.getByLabelText('About:');
    const experienceInput = screen.getByLabelText('Experience:');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(websiteInput, { target: { value: 'test-website' } });
    fireEvent.change(linkedinInput, { target: { value: 'test-linkedin' } });
    fireEvent.change(aboutInput, { target: { value: 'test-about' } });
    fireEvent.change(experienceInput, { target: { value: 'test-experience' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(AxiosInstance.put).toHaveBeenCalledWith(`api/resumes/${resumeId}/update/`, {
        website: 'test-website',
        linkedin: 'test-linkedin',
        about: 'test-about',
        experience: 'test-experience',
      });
    });
  });
});