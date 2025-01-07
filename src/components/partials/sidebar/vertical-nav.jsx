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
  emailItems,
  doctorItems,
  patientItems,
  uiElementsItems,
  formItems,
  formWizardItems,
  tableItems,
  chartItems,
  iconItems,
  authItems,
  extraPagesItems,
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
            <span className="item-name">Doctor Dashboard</span>
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
              className={`nav-item ${active === "Administration" && "active"}`}
              onClick={() => setActive("Administration")}
            >
              <div className="colors">
                <CustomToggle
                  eventKey="Administration"
                  activeClass={patientItems.some(
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
        
        <Nav.Item as="li">
          <Link
            to="/dashboard-pages/dashboard-1"
            className={`nav-link ${
              location.pathname === "/dashboard-pages/dashboard-1"
                ? "active"
                : ""
            }`}
          >
            <OverlayTrigger
              key={"HDashboard"}
              placement={"right"}
              overlay={<Tooltip id="Dashboard">Dashboard</Tooltip>}
            >
              <i
                className="ri-home-8-fill"
                data-bs-toggle="tooltip"
                title="Dashboard"
                data-bs-placement="right"
              ></i>
            </OverlayTrigger>
            <span className="item-name ">Hospital Dashboard 1 </span>
          </Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Link
            to="/dashboard-pages/dashboard-2"
            className={`nav-link ${
              location.pathname === "/dashboard-pages/dashboard-2"
                ? "active"
                : ""
            }`}
          >
            <OverlayTrigger
              key={"HDashboard2"}
              placement={"right"}
              overlay={<Tooltip id="Dashboard">Dashboard</Tooltip>}
            >
              <i className="ri-briefcase-4-fill"></i>
            </OverlayTrigger>
            <span className="item-name ">Hospital Dashboard 2</span>
          </Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Link
            to="/dashboard-pages/patient-dashboard"
            className={`nav-link ${
              location.pathname === "/dashboard-pages/patient-dashboard"
                ? "active"
                : ""
            }`}
          >
            <OverlayTrigger
              key={"PDashboard"}
              placement={"right"}
              overlay={<Tooltip id="Dashboard">Dashboard</Tooltip>}
            >
              <i className="ri-briefcase-4-fill"></i>
            </OverlayTrigger>
            <span className="item-name ">Patient Dashboard</span>
          </Link>
        </Nav.Item>
        {/* <Nav.Item as="li">
          <Link
            to="/dashboard-pages/dashboard-4"
            className={`nav-link  ${
              location.pathname === "/dashboard-pages/dashboard-4"
                ? "active"
                : ""
            }`}
          >
            <OverlayTrigger
              key={"CDashboard"}
              placement={"right"}
              overlay={<Tooltip id="Dashboard">Dashboard</Tooltip>}
            >
              <i className="ri-hospital-fill"></i>
            </OverlayTrigger>
            <span className="item-name ">Covid-19 Dashboard</span>
          </Link>
        </Nav.Item> */}
        <li>
          <hr className="hr-horizontal" />
        </li>
        <Accordion bsPrefix="bg-none" onSelect={(e) => setActiveMenu(e)}>
          <Nav.Item as="li" className="static-item ms-2">
            <Nav.Link className="static-item disabled text-start" tabIndex="-1">
              <span className="default-icon">Apps</span>
              <span className="mini-icon">-</span>
            </Nav.Link>
          </Nav.Item>

          {/* <Accordion.Item
            as="li"
            className={`nav-item ${active === "Email" && "active"} ${
              location.pathname === "/email/inbox" ||
              location.pathname === "/email /compose"
                ? "active"
                : ""
            }`}
            onClick={() => setActive("Email")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Email"
                activeClass={emailItems.some(
                  (item) => location.pathname === item.path
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Email"}
                  placement={"right"}
                  overlay={<Tooltip id="Email">Email</Tooltip>}
                >
                  <i className="ri-mail-open-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Email</span>
                <ArrowIcon />
              </CustomToggle>

              <Accordion.Collapse
                eventKey="Email"
                as="ul"
                className="sub-nav"
                id="Email"
              >
                <>
                  {emailItems.map(({ path, name, icon }) => (
                    <li key={path}>
                      <Link
                        className={`nav-link ${
                          location.pathname === path ? "active" : ""
                        }`}
                        to={path}
                      >
                        <i className={`icon ${icon}`}></i>
                        <span className="item-name">{name}</span>
                      </Link>
                    </li>
                  ))}
                </>
              </Accordion.Collapse>
            </div>
          </Accordion.Item> */}

          {/* <Accordion.Item
            as="li"
            className={`nav-item ${active === "Doctor" && "active"}`}
            onClick={() => setActive("Doctor")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Doctor"
                activeClass={doctorItems.some(
                  (item) => location.pathname === item.path
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Doctor"}
                  placement={"right"}
                  overlay={<Tooltip id="Doctor">Doctor</Tooltip>}
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
                <span className="item-name">Doctor</span>
                <ArrowIcon />
              </CustomToggle>

              <Accordion.Collapse
                as="ul"
                eventKey="Doctor"
                className="sub-nav"
                id="Doctor"
              >
                <>
                  {doctorItems.map(({ path, name, icon }) => (
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
          </Accordion.Item> */}

          <Nav.Item as="li">
            <Link
              className={`nav-link ${
                location.pathname === "/calendar" ? "active" : ""
              }`}
              to="/calendar"
            >
              <OverlayTrigger
                key={"Calendar"}
                placement={"right"}
                overlay={<Tooltip id="Calendar">Calendar</Tooltip>}
              >
                <i className="ri-calendar-2-line"></i>
              </OverlayTrigger>
              <span className="item-name ">Calendar</span>
            </Link>
          </Nav.Item>

          {/* <Nav.Item as="li">
            <Link
              className={`nav-link ${
                location.pathname === "/chat" ? "active" : ""
              }`}
              to="/chat"
            >
              <OverlayTrigger
                key={"Chat"}
                placement={"right"}
                overlay={<Tooltip id="Chat">Chat</Tooltip>}
              >
                <i className="ri-message-fill"></i>
              </OverlayTrigger>
              <span className="item-name ">Chat</span>
            </Link>
          </Nav.Item> */}

          {/* <Nav.Item as="li" className="static-item ms-2">
            <Nav.Link className="static-item disabled text-start" tabIndex="-1">
              <span className="default-icon">Components</span>
              <span className="mini-icon">-</span>
            </Nav.Link>
          </Nav.Item>
          <Accordion.Item
            as="li"
            bsPrefix={`nav-item ${active === "UIElements" && "active"}`}
            onClick={() => setActive("UIElements")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="UIElements"
                activeClass={uiElementsItems.some(
                  (item) => location.pathname === item.path
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"UIElements"}
                  placement={"right"}
                  overlay={<Tooltip id="UIElements">UIElements</Tooltip>}
                >
                  <i className="ri-apps-fill"></i>
                </OverlayTrigger>
                <span className="item-name">UI Elements</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                eventKey="UIElements"
                as="ul"
                className="sub-nav"
                id="UIElements"
              >
                <>
                  {uiElementsItems.map(({ path, name, icon }) => (
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
          <Accordion.Item
            as="li"
            bsPrefix={`nav-item ${active === "Forms" && "active"}`}
            onClick={() => setActive("Forms")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Forms"
                activeClass={formItems.some(
                  (item) => location.pathname === item.path
                )} // Check if any item path matches
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Forms"}
                  placement={"right"}
                  overlay={<Tooltip id="Forms">Forms</Tooltip>}
                >
                  <i className="ri-device-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Forms</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                as="ul"
                className="sub-nav"
                eventKey="Forms"
                id="Forms"
              >
                <>
                  {formItems.map(({ path, name, icon }) => (
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
          <Accordion.Item
            as="li"
            className={`nav-item ${active === "Form-Wizard" && "active"}`}
            onClick={() => setActive("Form-Wizard")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Form-Wizard"
                activeClass={formWizardItems.some(
                  (item) => item.path === location.pathname
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Forms-Wizard"}
                  placement={"right"}
                  overlay={<Tooltip id="Forms-Wizard">Forms Wizard</Tooltip>}
                >
                  <i className="ri-file-word-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Form Wizard</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                eventKey="Form-Wizard"
                as="ul"
                className="sub-nav"
                id="Form-Wizard"
              >
                <>
                  {formWizardItems.map(({ path, name, icon }) => (
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
          <Accordion.Item
            as="li"
            className={`nav-item ${active === "table" && "active"}`}
            onClick={() => setActive("table")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="table"
                activeClass={tableItems.some(
                  (item) => item.path === location.pathname
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Table"}
                  placement={"right"}
                  overlay={<Tooltip id="Table">Table</Tooltip>}
                >
                  <i className="ri-table-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Table</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                eventKey="table"
                as="ul"
                className="sub-nav"
                id="table"
              >
                <>
                  {tableItems.map(({ path, name, icon }) => (
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

          <Accordion.Item
            as="li"
            className={`nav-item ${active === "Chart" && "active"}`}
            onClick={() => setActive("Chart")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Chart"
                activeClass={chartItems.some(
                  (item) => item.path === location.pathname
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Chart"}
                  placement={"right"}
                  overlay={<Tooltip id="Chart">Chart</Tooltip>}
                >
                  <i className="ri-bar-chart-2-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Charts</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                eventKey="Chart"
                as="ul"
                className="sub-nav"
                id="Chart"
              >
                <>
                  {chartItems.map(({ path, name, icon }) => (
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

          <Accordion.Item
            as="li"
            className={`nav-item ${active === "Icons" && "active"}`}
            onClick={() => setActive("Icons")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Icons"
                activeClass={iconItems.some(
                  (item) => item.path === location.pathname
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Icons"}
                  placement={"right"}
                  overlay={<Tooltip id="Icons">Icons</Tooltip>}
                >
                  <i className="ri-bar-chart-2-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Icons</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                eventKey="Icons"
                as="ul"
                className="sub-nav"
                id="Icons"
              >
                <>
                  {iconItems.map(({ path, name, icon }) => (
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

          <Nav.Item as="li" className="static-item ms-2">
            <Nav.Link className="static-item disabled text-start" tabIndex="-1">
              <span className="default-icon ">Pages</span>
              <span className="mini-icon">-</span>
            </Nav.Link>
          </Nav.Item>
          <Accordion.Item
            as="li"
            eventKey="Authentication"
            className={`nav-item ${active === "Authentication" && "active"}`}
            onClick={() => setActive("Authentication")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Authentication"
                activeClass={authItems.some(
                  (item) => item.path === location.pathname
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Authentication"}
                  placement={"right"}
                  overlay={
                    <Tooltip id="Authentication">Authentication</Tooltip>
                  }
                >
                  <i className="ri-server-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Authentication</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                eventKey="Authentication"
                as="ul"
                className="sub-nav"
                id="Authentication"
              >
                <>
                  {authItems.map(({ path, name, icon }) => (
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

          <Accordion.Item
            as="li"
            eventKey="Maps"
            id="Maps"
            className={`nav-item ${active === "Maps" && "active"}`}
            onClick={() => setActive("Maps")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Maps"
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Maps"}
                  placement={"right"}
                  overlay={<Tooltip id="Maps">Maps</Tooltip>}
                >
                  <i className="ri-map-pin-2-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Maps</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                as="ul"
                eventKey="Maps"
                className="sub-nav"
                id="Maps"
              >
                <li>
                  <Link
                    className={`nav-link ${
                      location.pathname === "/maps/google-map" ? "active" : ""
                    }`}
                    to="/maps/google-map"
                  >
                    <i className="ri-google-fill"></i>
                    <span className="item-name">Google Map</span>
                  </Link>
                </li>
              </Accordion.Collapse>
            </div>
          </Accordion.Item>
          <Accordion.Item
            as="li"
            eventKey="0"
            id="Extrapages"
            className={`nav-item ${active === "Extrapages" && "active"}`}
            onClick={() => setActive("Extrapages")}
          >
            <div className="colors">
              <CustomToggle
                eventKey="Extrapages"
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={"Extrapages"}
                  placement={"right"}
                  overlay={<Tooltip id="Extrapages">Extrapages</Tooltip>}
                >
                  <i className="ri-folders-fill"></i>
                </OverlayTrigger>
                <span className="item-name">Extra Pages</span>
                <ArrowIcon />

              </CustomToggle>

              <Accordion.Collapse
                eventKey="Extrapages"
                as="ul"
                className="sub-nav"
                id="Extrapages"
              >
                <>
                  {extraPagesItems.map(({ path, name, icon }) => (
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
          </Accordion.Item> */}
        </Accordion>

        <li>
          <hr className="hr-horizontal" />
        </li>
      </ul>
    </>
  );
};

export default VerticalNav;
