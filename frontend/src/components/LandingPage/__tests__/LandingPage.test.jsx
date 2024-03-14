import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingPage from '../LandingPage';

describe('LandingPage component', () => {

  beforeAll(() => {

    vi.mock('../../Navbar/Navbar', async (importOriginal) => {
      const actual = await importOriginal()
      return {
        ...actual,
        Navbar: vi.fn(() => <div data-testid="mock-navbar"></div>),
      }
    });
    
    vi.mock('../Hero/Hero', async (importOriginal) => {
      const actual = await importOriginal()
      return {
        ...actual,
        Hero: vi.fn(() => <div data-testid="mock-hero"></div>),
      }
    });

    render(
      <LandingPage />
    );
  });

  test('renders Navbar component', () => {
    const navbar = screen.getByTestId('mock-navbar');
    expect(navbar).toBeInTheDocument();
  });

  test('renders Hero component', () => {
    const hero = screen.getByTestId('mock-hero');
    expect(hero).toBeInTheDocument();
  });
});
