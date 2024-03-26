import { render, waitFor, screen, act } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import UpdateResumePage from "../ResumePage";

vi.mock("@/utils/AxiosInstance");

vi.mock("@/features/job-seeker/Resume/Education/Education", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-education"></div>),
  };
});

vi.mock("@/features/job-seeker/Resume/Language/Language", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-language"></div>),
  };
});

vi.mock("@/features/job-seeker/Resume/ProfessionalExperience/ProfessionalExperience", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-professionalexperience"></div>),
  };
});

vi.mock("@/features/job-seeker/Resume/Skills/SoftSkill", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-softskill"></div>),
  };
});

vi.mock("@/features/job-seeker/Resume/Skills/TechnicalSkill", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-technicalskill"></div>),
  };
});

vi.mock("@/features/job-seeker/Resume/ResumeForm", async () => {
  return {
    default: vi.fn(() => <div data-testid="mock-resumeform"></div>),
  };
});


describe("UpdateResumePage", () => {
  const user = { user: { user_id: "123" } };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", async () => {

    AxiosInstance.get.mockResolvedValueOnce({
      status: 200,
      data: { resume: "456" },
    });

    await act(async () => {
      render(
        <AuthContext.Provider value={user}>
          <UpdateResumePage />
        </AuthContext.Provider>,
      )
    })

  });

  it("should render relevant components", async () => {

    AxiosInstance.get.mockResolvedValueOnce({
      status: 200,
      data: { resume: "456" },
    });

    await act(async () => {
      render(
        <AuthContext.Provider value={user}>
          <UpdateResumePage />
        </AuthContext.Provider>,
      )
    })

    expect(screen.getByTestId("mock-education")).toBeInTheDocument()
    expect(screen.getByTestId("mock-language")).toBeInTheDocument()
    expect(screen.getByTestId("mock-professionalexperience")).toBeInTheDocument()
    expect(screen.getByTestId("mock-softskill")).toBeInTheDocument()
    expect(screen.getByTestId("mock-technicalskill")).toBeInTheDocument()
    expect(screen.getByTestId("mock-resumeform")).toBeInTheDocument()
  })

  it("should fetch resumeId on component mount", async () => {

    AxiosInstance.get.mockResolvedValueOnce({
      status: 200,
      data: { resume: "456" },
    });

    await act(async () => {
      render(
        <AuthContext.Provider value={user}>
          <UpdateResumePage />
        </AuthContext.Provider>,
      )
    })

    await waitFor(() => {
      expect(AxiosInstance.get).toHaveBeenCalledWith(`api/job-seekers/123/`);
    });
  });

  it("should create a new resume if none exists", async () => {
    AxiosInstance.get.mockResolvedValueOnce({
      status: 200,
      data: { resume: null },
    });
    AxiosInstance.post.mockResolvedValueOnce({
      status: 200,
      data: { id: "789" },
    });

    await act(async () => {
      render(
        <AuthContext.Provider value={user}>
          <UpdateResumePage />
        </AuthContext.Provider>,
      )
    })

    await waitFor(() => {
      expect(AxiosInstance.get).toHaveBeenCalledWith(`api/job-seekers/123/`);

      expect(AxiosInstance.post).toHaveBeenCalledWith(`api/resumes/create/`, {
        github: "",
        linkedin: "",
        about: "",
        experience: "",
      });
      expect(AxiosInstance.patch).toHaveBeenCalledWith(`api/job-seekers/123/update/`, {
        resume: "789",
      });
    });
  });
});
