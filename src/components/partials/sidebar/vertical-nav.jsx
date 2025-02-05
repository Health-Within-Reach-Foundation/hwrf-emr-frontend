import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionContext,
  Collapse,
  Nav,
  OverlayTrigger,
  Tooltip,
  useAccordionButton,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../utilities/AuthProvider";
import {
  patientItems,
  adminiStartionItems,
} from "../../../utilities/constants";
import ArrowIcon from "../../arrow-icon";

const VerticalNav = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(false);
  const [active, setActive] = useState("");
  const { userRoles } = useAuth();

  function CustomToggle({ children, eventKey, onClick, activeClass }) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(eventKey, (active) =>
      onClick({ state: !active, eventKey: eventKey })
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
      <Link
        to="#"
        aria-expanded={isCurrentEventKey ? "true" : "false"}
        className={`nav-link ${
          activeEventKey === active || (eventKey === active && "active")
        } ${activeClass === true ? "active" : ""}`}
        role="button"
        onClick={(e) => {
          decoratedOnClick(isCurrentEventKey);
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <>
      <ul className="navbar-nav iq-main-menu" id="sidebar-menu">
        <Nav.Item as="li" className="static-item ms-2">
          <Link
            className="nav-link static-item disabled text-start"
            tabIndex="-1"
          >
            <span className="default-icon">Dashboard</span>
            <OverlayTrigger
              key={"Home"}
              placement={"right"}
              overlay={<Tooltip id="Home">Home</Tooltip>}
            >
              <span className="mini-icon">-</span>
            </OverlayTrigger>
          </Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <OverlayTrigger
              key={"DDashboard"}
              placement={"right"}
              overlay={<Tooltip id="Dashboard">Dashboard</Tooltip>}
            >
              <i className="ri-hospital-fill"></i>
            </OverlayTrigger>
            <span className="item-name">Dashboard</span>
          </Link>
        </Nav.Item>

        {/* clinics nav menu */}
        {userRoles.includes("superadmin") && (
          <Nav.Item as="li">
            <Link
              to="/clinics"
              className={`nav-link ${
                location.pathname === "/clinics" ? "active" : ""
              }`}
            >
              <OverlayTrigger
                key={"Dashboard"}
                placement={"right"}
                overlay={<Tooltip id="Dashboard">Clinics</Tooltip>}
              >
                <i className="ri-hospital-fill"></i>
              </OverlayTrigger>
              <span className="item-name">Clinics</span>
            </Link>
          </Nav.Item>
        )}

        {/* administartion nav menu items */}
        {userRoles.includes("admin") && (
          <Accordion bsPrefix="bg-none" onSelect={(e) => setActiveMenu(e)}>
            <Accordion.Item
              as="li"
              className={`nav-item ${active === "Administration" && "active"} ${
                location.pathname === "/administration/users-list" ||
                location.pathname === "/administration/add-user" ||
                location.pathname === "/administration/roles" 
                // location.pathname === "/administration/campaigns"
                  ? "active"
                  : ""
              }`}
              onClick={() => setActive("Administration")}
            >
              <div className="colors">
                <CustomToggle
                  eventKey="Administration"
                  activeClass={adminiStartionItems.some(
                    (item) => location.pathname === item.path
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={"Administration"}
                    placement={"right"}
                    overlay={
                      <Tooltip id="Administration">Administration</Tooltip>
                    }
                  >
                    <i className="ri-home-gear-line"></i>
                  </OverlayTrigger>
                  <span className="item-name">Administration</span>
                  <ArrowIcon />
                </CustomToggle>

                <Accordion.Collapse
                  as="ul"
                  eventKey="Administration"
                  className="sub-nav"
                  id="Administration"
                >
                  <>
                    {adminiStartionItems.map(({ path, name, icon }) => (
                      <li key={path}>
                        <Link
                          className={`nav-link ${
                            location.pathname === path ? "active" : ""
                          }`}
                          to={path}
                        >
                          <i className={icon}></i>
                          <span className="item-name">{name}</span>
                        </Link>
                      </li>
                    ))}
                  </>
                </Accordion.Collapse>
              </div>
            </Accordion.Item>
          </Accordion>
        )}
          {!userRoles.includes("superadmin") && (
          <Nav.Item as="li">
            <Link
              to="/queues"
              className={`nav-link ${
                location.pathname === "/queues" ? "active" : ""
              }`}
            >
              <OverlayTrigger
                key={"Queues"}
                placement={"right"}
                overlay={<Tooltip id="Dashboard">Queues</Tooltip>}
              >
                <i
                  className="ri-list-view"
                  data-bs-toggle="tooltip"
                  title="Queues"
                  data-bs-placement="right"
                ></i>
              </OverlayTrigger>
              <span className="item-name ">Queues </span>
            </Link>
          </Nav.Item>
        )}
        {!userRoles.includes("superadmin") && (
          <Nav.Item as="li">
            <Link
              to="/camps"
              className={`nav-link ${
                location.pathname === "/camps" ? "active" : ""
              }`}
            >
              <OverlayTrigger
                key={"Camps"}
                placement={"right"}
                overlay={<Tooltip id="Dashboard">All Camps</Tooltip>}
              >
                <i
                  className="ri-list-view"
                  data-bs-toggle="tooltip"
                  title="Camps"
                  data-bs-placement="right"
                ></i>
              </OverlayTrigger>
              <span className="item-name ">All Camps </span>
            </Link>
          </Nav.Item>
        )}
      
        {/* {userRoles.includes("superadmin") && (
          <Nav.Item as="li">
            <Link
              to="/form-templates"
              className={`nav-link ${
                location.pathname === "/form-templates" ? "active" : ""
              }`}
            >
              <OverlayTrigger
                key={"Form_Templtes"}
                placement={"right"}
                overlay={<Tooltip id="Dashboard">Form Templates</Tooltip>}
              >
                <i
                  className="ri-list-view"
                  data-bs-toggle="tooltip"
                  title="FormTempltes"
                  data-bs-placement="right"
                ></i>
              </OverlayTrigger>
              <span className="item-name ">Form Templates </span>
            </Link>
          </Nav.Item>
        )} */}

        {/* patients management */}
        {!userRoles.includes("superadmin") && (
          <Accordion bsPrefix="bg-none" onSelect={(e) => setActiveMenu(e)}>
            <Accordion.Item
              as="li"
              className={`nav-item ${active === "Patient" && "active"}`}
              onClick={() => setActive("Patient")}
            >
              <div className="colors">
                <CustomToggle
                  eventKey="Patient"
                  activeClass={patientItems.some(
                    (item) => location.pathname === item.path
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={"Patient"}
                    placement={"right"}
                    overlay={<Tooltip id="Patient">Patient</Tooltip>}
                  >
                    <i className="icon">
                      <svg
                        className="icon-20"
                        width="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.4"
                          d="M12.0865 22C11.9627 22 11.8388 21.9716 11.7271 21.9137L8.12599 20.0496C7.10415 19.5201 6.30481 18.9259 5.68063 18.2336C4.31449 16.7195 3.5544 14.776 3.54232 12.7599L3.50004 6.12426C3.495 5.35842 3.98931 4.67103 4.72826 4.41215L11.3405 2.10679C11.7331 1.96656 12.1711 1.9646 12.5707 2.09992L19.2081 4.32684C19.9511 4.57493 20.4535 5.25742 20.4575 6.02228L20.4998 12.6628C20.5129 14.676 19.779 16.6274 18.434 18.1581C17.8168 18.8602 17.0245 19.4632 16.0128 20.0025L12.4439 21.9088C12.3331 21.9686 12.2103 21.999 12.0865 22Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M11.3194 14.3209C11.1261 14.3219 10.9328 14.2523 10.7838 14.1091L8.86695 12.2656C8.57097 11.9793 8.56795 11.5145 8.86091 11.2262C9.15387 10.9369 9.63207 10.934 9.92906 11.2193L11.3083 12.5451L14.6758 9.22479C14.9698 8.93552 15.448 8.93258 15.744 9.21793C16.041 9.50426 16.044 9.97004 15.751 10.2574L11.8519 14.1022C11.7049 14.2474 11.5127 14.3199 11.3194 14.3209Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </i>
                  </OverlayTrigger>
                  <span className="item-name">Patient</span>
                  <ArrowIcon />
                </CustomToggle>

                <Accordion.Collapse
                  as="ul"
                  eventKey="Patient"
                  className="sub-nav"
                  id="Patient"
                >
                  <>
                    {patientItems.map(({ path, name, icon }) => (
                      <li key={path}>
                        <Link
                          className={`nav-link ${
                            location.pathname === path ? "active" : ""
                          }`}
                          to={path}
                        >
                          <i className={icon}></i>
                          <span className="item-name">{name}</span>
                        </Link>
                      </li>
                    ))}
                  </>
                </Accordion.Collapse>
              </div>
            </Accordion.Item>
          </Accordion>
        )}
      </ul>
    </>
  );
};

export default VerticalNav;
