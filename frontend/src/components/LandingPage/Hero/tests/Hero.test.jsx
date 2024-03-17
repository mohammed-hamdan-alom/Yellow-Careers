import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Hero } from '../Hero';
import { buttonVariants } from '@/components/ui/button'; 


vi.mock('../../HeroCards/HeroCards', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    HeroCards: vi.fn(() => <div data-testid="mock-hero-cards"></div>)
  };
});

describe('Hero component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Hero />
      </Router>
    );
  });

  test('renders welcome message', () => {
    const welcomeText = screen.getByText(/Welcome to/i);
    expect(welcomeText).toBeInTheDocument();
  });
  
  test('renders Yellow careers', () => {
    const yellowCareersText = screen.getByText(/Yellow Careers/i);
    expect(yellowCareersText).toBeInTheDocument();
  });
  
  test('renders description text', () => {
    const descriptionText = screen.getByText(/Find the perfect job for you/i);
    expect(descriptionText).toBeInTheDocument();
  });

  test('renders Get started button', () => {
    const getStartedButton = screen.getByText(/Get started/i);
    expect(getStartedButton).toBeInTheDocument();
  });

  test('renders Login button', () => {
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toBeInTheDocument();
  });

  test('calls buttonVariants with correct props for Get started button', () => {
    const buttonProps = { variant: 'default' };
    const expectedClassName = buttonVariants(buttonProps);
    const getStartedButton = screen.getByText(/Get started/i);
    expect(getStartedButton).toHaveClass(expectedClassName);
  });

  test('calls buttonVariants with correct props for Login button', () => {
    const buttonProps = { variant: 'outline' };
    const expectedClassName = buttonVariants(buttonProps);
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toHaveClass(expectedClassName);
  });

  test('renders HeroCards component', () => {
    const heroCardsComponent = screen.getByTestId('mock-hero-cards');
    expect(heroCardsComponent).toBeInTheDocument();
  });

  test('navigates to /auth/get-started when Get started button is clicked', () => {
    const getStartedButton = screen.getByText(/Get started/i);
    fireEvent.click(getStartedButton);
    expect(window.location.pathname).toBe('/auth/get-started');
  });

  test('navigates to /auth/login when Login button is clicked', () => {
    const loginButton = screen.getByText(/Login/i);
    fireEvent.click(loginButton);
    expect(window.location.pathname).toBe('/auth/login');
  });
});
