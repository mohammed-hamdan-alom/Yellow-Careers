import React from "react";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroCards } from "../HeroCards";

vi.mock("@/components/ui/button", () => ({
  buttonVariants: vi.fn(() => "mock-button-className"),
}));
vi.mock("@/components/ui/avatar", () => ({
  Avatar: vi.fn(({ children }) => <div>{children}</div>),
  AvatarFallback: vi.fn(({ children }) => <div>{children}</div>),
  AvatarImage: vi.fn(({ src, alt }) => <img src={src} alt={alt} />),
}));
vi.mock("@/components/ui/card", () => ({
  Card: vi.fn(({ children }) => <div>{children}</div>),
  CardHeader: vi.fn(({ children }) => <div>{children}</div>),
  CardContent: vi.fn(({ children }) => <div>{children}</div>),
  CardDescription: vi.fn(({ children }) => <div>{children}</div>),
  CardTitle: vi.fn(({ children }) => <div>{children}</div>),
  CardFooter: vi.fn(({ children }) => <div>{children}</div>),
}));
vi.mock("lucide-react", () => ({
  Check: vi.fn(() => <div>Check Icon</div>),
  Linkedin: vi.fn(() => <div>Linkedin Icon</div>),
}));
vi.mock("@radix-ui/react-icons", () => ({
  GitHubLogoIcon: vi.fn(() => <div>GitHub Icon</div>),
}));

describe("HeroCards component", () => {
  beforeEach(() => {
    render(<HeroCards />);
  });

  test("renders testimonial card with correct content", () => {
    const avatarImage = screen.getByAltText("");
    expect(avatarImage).toHaveAttribute(
      "src",
      "https://github.com/mohammed-hamdan-alom.png"
    );

    const testimonialContent = screen.getByText(
      /If you're looking for a job, Yellow Careers is the way to go/i
    );
    expect(testimonialContent).toBeInTheDocument();
  });

  test("renders team card with correct content", () => {
    const avatarImage = screen.getByAltText("user avatar");
    expect(avatarImage).toHaveAttribute(
      "src",
      "/src/components/LandingPage/assets/shazaib.png"
    );

    const teamMemberName = screen.getByText("Malik Shahzaib Khan");
    expect(teamMemberName).toBeInTheDocument();

    const teamMemberRole = screen.getByText("Full Stack Developer");
    expect(teamMemberRole).toBeInTheDocument();

    const teamMemberDescription = screen.getByText(
      /I really enjoy transforming ideas into functional software that exceeds expectations/i
    );
    expect(teamMemberDescription).toBeInTheDocument();
  });

  test("renders social media icons in team card with correct links", () => {
    const githubIcon = screen.getByText("GitHub Icon");
    expect(githubIcon).toBeInTheDocument();

    const linkedinIcon = screen.getByText("Linkedin Icon");
    expect(linkedinIcon).toBeInTheDocument();

    const socialMediaLinks = screen.getAllByRole("link");
    expect(socialMediaLinks).toHaveLength(3);

    socialMediaLinks.forEach((link) => {
      expect(link).toHaveClass("mock-button-className");
    });
  });
});
