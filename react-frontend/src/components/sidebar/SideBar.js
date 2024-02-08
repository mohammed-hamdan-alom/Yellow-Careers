import React from "react";
import "./SideBar.css";
import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

function SideBar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const isActive = (pathname) => location.pathname === pathname;

  return (
    <>
      <Icon
        size="large"
        onClick={toggleSidebar}
        className={`icon ${isOpen ? "active" : ""}`}
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
          to="/job-seeker/dashboard"
          active={isActive("/job-seeker/dahsboard")}
          onClick={toggleSidebar}
        >
          <Icon name="block layout" />
          Dashboard
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/job-seeker/search"
          active={isActive("/search")}
          onClick={toggleSidebar}
        >
          <Icon name="search" />
          Search
        </Menu.Item>
      </Sidebar>
    </>
  );
}

export default SideBar;