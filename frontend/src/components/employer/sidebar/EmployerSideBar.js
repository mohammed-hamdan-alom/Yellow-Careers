import React from "react";
import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";

function EmployerSideBar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const isActive = (pathname) => location.pathname === pathname;

  return (
    <>
      <Icon
        size="large"
        onClick={toggleSidebar}
        className={`custom-icon ${isOpen ? "active" : ""}`}
        aria-label="Toggle sidebar"
        name="chevron left"
      />

      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        onHide={toggleSidebar}
        vertical
        visible={isOpen}
        width="thin"
        className="side-bar"
      >
        <Menu.Item
          as={Link}
          to="/employer/dashboard"
          active={isActive("/dahsboard")}
          onClick={toggleSidebar}
        >
          <Icon name="block layout" />
          Dashboard
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/employer/create-job"
          active={isActive("/create-job")}
          onClick={toggleSidebar}
        >
          <Icon name="search" />
          Job Creation
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/employer/company"
          active={isActive("/company")}
          onClick={toggleSidebar}
        >
          <Icon name="building outline" />
          Company
        </Menu.Item>

      </Sidebar>
    </>
  );
}

export default EmployerSideBar;
