import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";

const user = {
  name: "John Doe",
  email: "john@example.com",
  imageUrl: "/path/to/image.jpg",
};
const navigation = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Profile", to: "/profile" },
  { name: "Settings", to: "/settings" },
];
const userNavigation = [
  { name: "Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
  { name: "Sign out", href: "#" },
];

describe("DashboardLayout component", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <DashboardLayout
          user={user}
          navigation={navigation}
          userNavigation={userNavigation}
          baseUrl="/dashboard"
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
  test("renders navigation links correctly", () => {
    render(
      <MemoryRouter>
        <DashboardLayout
          user={user}
          navigation={navigation}
          userNavigation={userNavigation}
          baseUrl="/dashboard"
        />
      </MemoryRouter>,
    );
    navigation.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  test("renders user information and user navigation menu correctly", () => {
    render(
      <MemoryRouter>
        <DashboardLayout
          user={user}
          navigation={navigation}
          userNavigation={userNavigation}
          baseUrl="/dashboard"
        />
      </MemoryRouter>,
    );
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    fireEvent.click(screen.getByText(user.name));
    userNavigation.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  test("clicking on logout button triggers logout function", () => {
    const logoutUser = vi.fn();
    render(
      <MemoryRouter>
        <DashboardLayout
          user={user}
          navigation={navigation}
          userNavigation={userNavigation}
          baseUrl="/dashboard"
          logoutUser={logoutUser}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Sign out"));
    expect(logoutUser).toHaveBeenCalled();
  });

  test("mobile menu toggle works as expected", () => {
    render(
      <MemoryRouter>
        <DashboardLayout
          user={user}
          navigation={navigation}
          userNavigation={userNavigation}
          baseUrl="/dashboard"
        />
      </MemoryRouter>,
    );
    const menuToggle = screen.getByRole("button", { name: "Open main menu" });
    fireEvent.click(menuToggle);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
