import React from "react";
import "semantic-ui-css/semantic.min.css";
import "./SideBar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import IconExampleLoadingGroup from "./NoDis";

function SideBar({ isOpen, toggleSidebar }) {
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
          to="/job-seeker/dashboard"
          active={isActive("/dahsboard")}
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

        <Menu.Item
          as={Link}
          to="/job-seeker/resume"
          active={isActive("/resume")}
          onClick={toggleSidebar}
        >
          <Icon name="edit" />
          Resume
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/job-seeker/applied-jobs"
          active={isActive("/applied-jobs")}
          onClick={toggleSidebar}
        >
          <IconExampleLoadingGroup />
          Applied Jobs
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/job-seeker/saved-jobs"
          active={isActive("/saved-jobs")}
          onClick={toggleSidebar}
        >
          <Icon loading name="blind" />
          Saved Jobs
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/job-seeker/profile"
          active={isActive("/profile")}
          onClick={toggleSidebar}
        >
          <Icon name="user" />
          Profile
        </Menu.Item>


      </Sidebar>
    </>
  );
}

export default SideBar;