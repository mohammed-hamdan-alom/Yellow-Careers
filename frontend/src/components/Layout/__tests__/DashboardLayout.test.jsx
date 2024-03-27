import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import AuthContext from "@/context/AuthContext";

const logoutUser = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  __esModule: true,
  default: React.createContext()
}));

const user = {
  name: "John Doe",
  email: "john@example.com",
  imageUrl: "/path/to/image.jpg",
};

const logout = {
  logoutUser: logoutUser
}

const navigation = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Profile", to: "/profile" },
  { name: "Settings", to: "/settings" },
];
const userNavigation = [
  { name: "Your Profile", href: "/profile" },
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

  test("renders user information and user navigation menu correctly", async () => {
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
    expect(screen.getByText(user.email)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(user.email));
    })

    userNavigation.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  test("clicking on logout button triggers logout function", async () => {

    render(
      <MemoryRouter>
        <AuthContext.Provider value={logout}>
          <DashboardLayout
            user={user}
            navigation={navigation}
            userNavigation={userNavigation}
            baseUrl="/dashboard"
          />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await act(async () => {
      fireEvent.click(screen.getByText(user.email));
    })

    await act(async () => {
      fireEvent.click(screen.getByText("Sign out"));
    })

    expect(logoutUser).toHaveBeenCalled();
  });

  test("mobile menu toggle works as expected", async () => {
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
    await act(async () => {
      fireEvent.click(menuToggle);
    })

    expect(screen.getAllByText("Dashboard")[0]).toBeInTheDocument();
  });
});
