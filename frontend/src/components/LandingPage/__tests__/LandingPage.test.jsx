import React from "react";
import { vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import LandingPage from "../LandingPage";

vi.mock("../../Navbar/Navbar", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navbar: vi.fn(() => <div data-testid="mock-navbar"></div>),
  };
});

vi.mock("../Hero/Hero", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Hero: ({ children }) => <div data-testid="mock-hero">{children}</div>,
  };
});

describe("LandingPage component", () => {
  beforeEach(async () => {
    await act(async () => {
      render(<LandingPage />);
    })
  });

  test("renders Navbar component", () => {
    const navbar = screen.getByTestId("mock-navbar");
    expect(navbar).toBeInTheDocument();
  });

  test("renders Hero component", () => {
    const hero = screen.getByTestId("mock-hero");
    expect(hero).toBeInTheDocument();
  });
});
