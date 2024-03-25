import React, { Fragment, useContext, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AuthContext from "@/context/AuthContext";
import logo from "./assets/yellow-careers-logo.png";
import styled from "styled-components";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Styled NavLink component
const CustomNavLink = styled(NavLink)`
  position: relative; /* Position relative for absolute positioning of the underline */

  &:hover {
    &::after {
      content: ""; /* Create pseudo-element for the underline */
      position: absolute; /* Position the underline */
      left: 0; /* Start from the left edge of the link */
      bottom: -5px; /* Adjust the distance of the underline from the text */
      width: 100%; /* Full width of the link */
      border-bottom: 2px solid #ffd700; /* Underline style */
    }
  }

  &.active {
    font-weight: bold;
    color: #ffd700; /* Yellow color */

    &::after {
      content: ""; /* Create pseudo-element for the underline */
      position: absolute; /* Position the underline */
      left: 0; /* Start from the left edge of the link */
      bottom: -5px; /* Adjust the distance of the underline from the text */
      width: 100%; /* Full width of the link */
      border-bottom: 2px solid #ffd700; /* Underline style */
    }
  }
`;

const DashboardLayout = ({ user, navigation, userNavigation, baseUrl }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  const { logoutUser } = authContext || {};

  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshedDashboardLayout");

    if (!hasRefreshed) {
      // If hasRefreshed is false, set it to true and reload the page
      localStorage.setItem("hasRefreshedDashboardLayout", true);
      window.location.reload();
    }

    // Schedule a reload every 15 minutes, regardless of whether the page has been refreshed before
    const timer = setInterval(() => {
      window.location.reload();
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => clearInterval(timer);
  }, []);

  const activeNavItem =
    navigation.find((item) => location.pathname.includes(item.to)) || {};

  return (
    <>
      <div className="min-h-full">
        <Disclosure
          as="nav"
          className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background"
        >
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <NavLink
                        to={`${baseUrl}/dashboard`}
                        className="flex items-center"
                      >
                        <img
                          className="h-8 w-8"
                          src={logo}
                          alt="Yellow Careers"
                        />
                      </NavLink>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <CustomNavLink
                            key={item.name}
                            to={`${baseUrl}${item.to}`}
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-black"
                          >
                            {item.name}
                          </CustomNavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm ">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <span className="text-gray-500 mr-2">
                              {user.email}
                            </span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                    onClick={() => {
                                      if (item.name === "Sign out") {
                                        logoutUser();
                                      }
                                    }}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-700 hover:text-gray-700">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <CustomNavLink
                      key={item.name}
                      to={`${baseUrl}${item.to}`}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:text-black"
                    >
                      {item.name}
                    </CustomNavLink>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="sticky border-b-[1px] w-full bg-white dark:border-b-slate-700 dark:bg-background">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {activeNavItem.name}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
