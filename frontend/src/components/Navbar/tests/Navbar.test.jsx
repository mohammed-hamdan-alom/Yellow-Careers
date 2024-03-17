import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../Navbar';
import { buttonVariants } from '@/components/ui/button';

vi.mock("@/components/ui/button", () => ({
  buttonVariants: vi.fn(() => "mock-button-className"),
}));
vi.mock('@radix-ui/react-icons', () => ({
  GitHubLogoIcon: vi.fn(() => <div>GitHub Icon</div>),
}));
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    Menu: vi.fn(() => <div>Menu Icon</div>),
  }
})

describe('Navbar component', () => {
  test('renders logo correctly', () => {
    render(<Navbar />);
    const logo = screen.getByText(/Yellow Careers/i);
    expect(logo).toBeInTheDocument();
  });

  test('toggles menu open state when menu icon is clicked', () => {
    render(<Navbar />);
    const menuIcon = screen.getByText('Menu Icon');
    fireEvent.click(menuIcon);
    const sheetTitle = screen.getByTestId('logo');
    expect(sheetTitle).toBeInTheDocument();
  });

  test('renders GitHub link with correct attributes', () => {
    render(<Navbar />);
    const githubLink = screen.getByTestId('github');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/mohammed-hamdan-alom/Job-Hiring-App-Team-Yellow-Card');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(buttonVariants).toHaveBeenCalledWith({ variant: 'secondary' });
    expect(screen.getByText('GitHub Icon')).toBeInTheDocument();
  });
});
