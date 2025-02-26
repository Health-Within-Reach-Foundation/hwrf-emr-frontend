import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import From React Bootstrap
import { Col, Container, Dropdown, Nav, Navbar, Row } from "react-bootstrap";

// Import selectors & action from setting store
import * as SettingSelector from "../../../store/setting/selectors";

// Redux Selector / Action
import { useSelector } from "react-redux";

// Import Image
import flag01 from "/assets/images/small/flag-01.png";
import flag02 from "/assets/images/small/flag-02.png";
import flag03 from "/assets/images/small/flag-03.png";
import flag04 from "/assets/images/small/flag-04.png";
import flag05 from "/assets/images/small/flag-05.png";
import flag06 from "/assets/images/small/flag-06.png";

import { useAuth } from "../../../utilities/AuthProvider";
import { RiHammerLine, RiLogoutBoxLine, RiMenuLine } from "@remixicon/react";
import { Button, Image } from "antd";
// import SettingOffCanvas from "../../setting/SettingOffCanvas";

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const Header = () => {
  const pageLayout = useSelector(SettingSelector.page_layout);
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userRoles } = useAuth();

  useEffect(() => {
    const handleScrolld = () => {
      if (window.scrollY >= 75) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScrolld);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScrolld);
    };
  }, []);

  // Fullscreen Functionality
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
      setIsFullScreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  const handleSidebar = () => {
    let aside = document.getElementsByTagName("ASIDE")[0];
    if (aside) {
      if (!aside.classList.contains("sidebar-mini")) {
        aside.classList.toggle("sidebar-mini");
        aside.classList.toggle("sidebar-hover");
      } else {
        aside.classList.remove("sidebar-mini");
        aside.classList.remove("sidebar-hover");
      }

      if (window.innerWidth < 990) {
        if (!aside.classList.contains("sidebar-mini")) {
          aside.classList.remove("sidebar-mini");
          aside.classList.toggle("sidebar-hover");
        }
      }
    }
  };

  return (
    <>
      {/* <Navbar> */}
      <Navbar
        className={`nav navbar-expand-xl navbar-light iq-navbar pt-2 pb-2 px-2 iq-header ${
          isScrolled ? "fixed-header" : ""
        } ${pageLayout === "container-fluid" ? "" : "container-box"}`}
        id="boxid"
      >
        <Container fluid className="navbar-inner">
          <Row className="flex-grow-1">
            {/* <Col lg={4} md={6} className="align-items-center d-flex">
              <Nav.Item
                as="li"
                className="nav-item dropdown search-width pt-2 pt-lg-0"
              >
                <div className="form-group input-group mb-0 search-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type here to search..."
                  />{" "}
                  <span className="input-group-text">
                    <svg
                      className="icon-20 text-primary"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="11.7669"
                        cy="11.7666"
                        r="8.98856"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></circle>
                      <path
                        d="M18.0186 18.4851L21.5426 22"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </span>
                </div>
              </Nav.Item>
            </Col> */}
            <Col
              lg={12}
              md={12}
              className="d-flex justify-content-end align-items-center"
            >
              <Nav.Item
                as="li"
                className="nav-item iq-full-screen d-none d-xl-block"
                id="fullscreen-item"
              >
                <a
                  href="#"
                  className="nav-link"
                  id="btnFullscreen"
                  onClick={() => toggleFullScreen()}
                >
                  <i
                    className={`ri-fullscreen-line normal-screen ${
                      isFullScreen ? "d-none" : ""
                    }`}
                  ></i>
                  <i
                    className={`ri-fullscreen-exit-line full-normal-screen ${
                      isFullScreen ? "" : " d-none"
                    }`}
                  ></i>
                </a>
                {/* <SettingOffCanvas /> */}
              </Nav.Item>
              <Nav.Item
                as="li"
                className="nav-item d-block d-xl-none"
                onClick={handleSidebar}
              >
                <a
                  className="wrapper-menu"
                  data-toggle="sidebar"
                  data-active="true"
                >
                  <div className="main-circle">
                    <RiMenuLine /> 
                  </div>
                </a>
              </Nav.Item>

              {/* -- dropdown -- */}
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle
                  as="a"
                  bsPrefix=" "
                  to="#"
                  className="nav-link d-flex align-items-center cursor-pointer"
                  id="notification-drop"
                >
                  <Image
                    preview={false}
                    src={generatePath("/assets/images/hwrf-vertical.svg")}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "100px",
                    }}
                    className="img-fluid rounded-circle mr-2"
                    alt="user"
                  />
                  <div className="caption d-none d-lg-block">
                    <h6 className="mb-0 line-height">{user.name}</h6>
                    <span className="font-size-12">{userRoles.join(", ")}</span>
                  </div>{" "}
                </Dropdown.Toggle>{" "}
                <Dropdown.Menu
                  as="div"
                  className="p-0 sub-drop dropdown-menu dropdown-menu-end"
                  aria-labelledby="notification-drop"
                >
                  <div className="m-0 -none card">
                    <div className="py-3 card-header d-flex justify-content-between bg-primary mb-0 rounded-top-3">
                      <div className="header-title">
                        <h5 className="mb-0 text-white font-weight-bold">
                          {user.name}
                        </h5>
                      </div>
                    </div>
                    <div className="p-0 card-body">
                      {/* <Link to="/doctor/doctor-profile" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary-subtle px-3 py-2 rounded-1">
                            <i className="ri-file-user-line "></i>
                          </div>
                          <div className="ms-3 flex-grow-1 text-start">
                            <h6 className="mb-0 ">My Profile</h6>
                            <p className="mb-0">
                              View personal profile details.
                            </p>
                          </div>
                        </div>
                      </Link> */}
                      {/* <Link to="/doctor/edit-doctor" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary-subtle px-3 py-2 rounded-1">
                            <i className="ri-profile-line "></i>
                          </div>
                          <div className="ms-3 flex-grow-1 text-start">
                            <h6 className="mb-0 ">Edit Profile</h6>
                            <p className="mb-0">
                              Modify your personal details.
                            </p>
                          </div>
                        </div>
                      </Link> */}
                      {/* <Link
                        to="/extra-pages/account-setting"
                        className="iq-sub-card"
                      >
                        <div className="d-flex align-items-center">
                          <div className="bg-primary-subtle px-3 py-2 rounded-1">
                            <i className="ri-account-box-line "></i>
                          </div>
                          <div className="ms-3 flex-grow-1 text-start">
                            <h6 className="mb-0 ">Account Settings</h6>
                            <p className="mb-0">
                              Manage your account parameters.
                            </p>
                          </div>
                        </div>
                      </Link> */}
                      {/* <Link
                        to="/extra-pages/privacy-setting"
                        className="iq-sub-card"
                      >
                        <div className="d-flex align-items-center">
                          <div className="bg-primary-subtle px-3 py-2 rounded-1">
                            <i className="ri-lock-line"></i>
                          </div>
                          <div className="ms-3 flex-grow-1 text-start">
                            <h6 className="mb-0 ">Privacy Settings</h6>
                            <p className="mb-0">
                              Control your privacy parameters.
                            </p>
                          </div>
                        </div>
                      </Link> */}
                      <div className="iq-sub-card d-flex justify-content-center">
                        <Button
                          onClick={() => {
                            auth.logout();
                          }}
                          className="btn-primary-subtle bg-primary-subtle"
                        >
                          Sign out
                          <RiLogoutBoxLine className="ms-2" size={15} />
                          {/* <i className="ri-login-box-line ms-2"></i> */}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
