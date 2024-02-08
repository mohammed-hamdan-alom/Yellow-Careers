import React from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./SideBar.css";
import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap.min.css";



// function SideBar({ isOpen, toggleSidebar }) {
//   const navigate = useNavigate(); // Hook for navigation

//   // Function to handle button click and navigate to the route
//   const handleNavigation = (path) => {
//     navigate(path);
//     // toggleSidebar(); // Optionally close the sidebar upon navigating
//   };

//   return (
    // <div className="sidebar-container">
    //   <div className="sidebar-toggle-button">
    //     <button
    //       className="btn btn-primary sidebar-toggle btn-sidebar"
    //       type="button"
    //       onClick={toggleSidebar} // Use the passed-in function
    //     >
    //       {isOpen ? "Close" : "Open"} Sidebar
    //     </button>
    //   </div>
    //   <div className={`sidebar ${!isOpen ? "collapsed" : ""}`} id="sidebarMenu">
    //     <div className="list-group list-group-flush">
    //       {/* Use buttons for navigation */}
    //       <button
    //         className="list-group-item list-group-item-action btn-sidebar"
    //         onClick={() => handleNavigation("/job-seeker/dashboard")}
    //       >
    //         Dashboard
    //       </button>
    //       <button
    //         className="list-group-item list-group-item-action btn-sidebar"
    //         onClick={() => handleNavigation("/job-seeker/search")}
    //       >
    //         Search
    //       </button>
    //       {/* More buttons for other navigation paths */}
    //     </div>
    //   </div>
    // </div>

    // BOOTSTRAP------------------
    // <div>
    //   <nav class="navbar bg-body-tertiary fixed-top">
    //     <div class="container-fluid">
    //       <a class="navbar-brand" href="/job-seeker/dashboard">
    //         Yellow Careers
    //       </a>
    //       <button
    //         class="navbar-toggler"
    //         type="button"
    //         data-bs-toggle="offcanvas"
    //         data-bs-target="#offcanvasNavbar"
    //         aria-controls="offcanvasNavbar"
    //         aria-label="Toggle navigation"
    //       >
    //         <span class="navbar-toggler-icon"></span>
    //       </button>
    //       <div
    //         class="offcanvas offcanvas-start"
    //         tabindex="-1"
    //         id="offcanvasNavbar"
    //         aria-labelledby="offcanvasNavbarLabel"
    //       >
    //         <div class="offcanvas-header">
    //           <h5 class="offcanvas-title" id="offcanvasNavbarLabel">
    //             Offcanvas
    //           </h5>
    //           <button
    //             type="button"
    //             class="btn-close"
    //             data-bs-dismiss="offcanvas"
    //             aria-label="Close"
    //           ></button>
    //         </div>
    //         <div class="offcanvas-body">
    //           <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
    //             <li class="nav-item">
    //                 <button
    //                   className="list-group-item list-group-item-action btn-sidebar"
    //                   onClick={() => handleNavigation("/job-seeker/search")}
    //                 >
    //                   SEARCH
    //                 </button>
    //             </li>
    //             <li class="nav-item">
    //                 <button
    //                   className="list-group-item list-group-item-action btn-sidebar"
    //                   onClick={() => handleNavigation("/job-seeker/dashboard")}
    //                 >
    //                   dashboard
    //                 </button>
    //             </li>
    //             {/* <li class="nav-item dropdown">
    //               <a
    //                 class="nav-link dropdown-toggle"
    //                 href="/search"
    //                 role="button"
    //                 data-bs-toggle="dropdown"
    //                 aria-expanded="false"
    //               >
    //                 Dropdown
    //               </a>
    //             </li> */}
    //           </ul>
    //         </div>
    //       </div>
    //     </div>
    //   </nav>
    // </div>
//   );
// }

// export default SideBar;
// import React from "react";
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

function SideBar({ isOpen, toggleSidebar }) {
  // Use the useLocation hook to get the current pathname
  const location = useLocation();

  // Helper function to determine if a menu item is active based on the current location
  const isActive = (pathname) => location.pathname === pathname;

  return (
    <>
      <Icon
        name="bars"
        size="large"
        onClick={toggleSidebar}
        className={`burger-icon ${isOpen ? "active" : ""}`}
        aria-label="Toggle sidebar"
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
        {/* Add additional Menu.Items here as needed */}
      </Sidebar>

      {/* Dimmed background content */}
    </>
  );
}

export default SideBar;