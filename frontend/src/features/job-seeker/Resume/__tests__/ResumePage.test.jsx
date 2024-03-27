import { render, waitFor, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import AuthContext from '@/context/AuthContext';
import AxiosInstance from "@/utils/AxiosInstance";
import UpdateResumePage from '../ResumePage';

vi.mock("@/utils/AxiosInstance");

describe('UpdateResumePage', () => {
  const user = { user_id: '123' };
  const mockContext = { user };

  beforeEach(() => {
    AxiosInstance.get.mockResolvedValueOnce({
      status: 200,
      data: { resume: '456' },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <AuthContext.Provider value={mockContext}>
        <UpdateResumePage />
      </AuthContext.Provider>
    );
  });

  it('should fetch resumeId on component mount', async () => {
    render(
      <AuthContext.Provider value={mockContext}>
        <UpdateResumePage />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosInstance.get).toHaveBeenCalledWith(`api/job-seekers/${user.user_id}/`);
    });
  });

  it('should create a new resume if none exists', async () => {
    AxiosInstance.get.mockResolvedValueOnce({
      status: 200,
      data: { resume: null },
    });
    AxiosInstance.post.mockResolvedValueOnce({
      status: 200,
      data: { id: '789' },
    });

    render(
      <AuthContext.Provider value={mockContext}>
        <UpdateResumePage />
      </AuthContext.Provider>
    );

    await waitFor(() => {

      expect(AxiosInstance.get).toHaveBeenCalledWith(`api/job-seekers/${user.user_id}/`);

      expect(AxiosInstance.post).toHaveBeenCalledWith(`api/resumes/create/`, {
        website: "",
        linkedin: "",
        about: "",
        experience: "",
      });
      expect(AxiosInstance.patch).toHaveBeenCalledWith(`api/job-seekers/${user.user_id}/update/`, {
        resume: '789',
      });
    });
  });
});