import { render, screen, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ResumeForm from '../ResumeForm';
import AxiosInstance from '@/utils/AxiosInstance';
import AuthContext from '@/context/AuthContext';

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

    const githubInput = screen.getByLabelText('Github:');
    const linkedinInput = screen.getByLabelText('LinkedIn:');
    const aboutInput = screen.getByLabelText('About:');
    const experienceInput = screen.getByLabelText('Experience:');

    fireEvent.change(githubInput, { target: { value: 'test-github' } });
    fireEvent.change(linkedinInput, { target: { value: 'test-linkedin' } });
    fireEvent.change(aboutInput, { target: { value: 'test-about' } });
    fireEvent.change(experienceInput, { target: { value: 'test-experience' } });

    expect(githubInput.value).toBe('test-github');
    expect(linkedinInput.value).toBe('test-linkedin');
    expect(aboutInput.value).toBe('test-about');
    expect(experienceInput.value).toBe('test-experience');
  });

  it('submits the form', async () => {
    const { getByLabelText, getByText } = render(
        <ResumeForm />
    );

    const githubInput = screen.getByLabelText('Github:');
    const linkedinInput = screen.getByLabelText('LinkedIn:');
    const aboutInput = screen.getByLabelText('About:');
    const experienceInput = screen.getByLabelText('Experience:');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(githubInput, { target: { value: 'test-github' } });
    fireEvent.change(linkedinInput, { target: { value: 'test-linkedin' } });
    fireEvent.change(aboutInput, { target: { value: 'test-about' } });
    fireEvent.change(experienceInput, { target: { value: 'test-experience' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(AxiosInstance.put).toHaveBeenCalledWith(`/api/resumes/${resumeId}/update/`, {
        github: 'test-github',
        linkedin: 'test-linkedin',
        about: 'test-about',
        experience: 'test-experience',
      });
    });
  });
});