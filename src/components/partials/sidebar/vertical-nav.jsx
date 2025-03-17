import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionContext,
  Nav,
  OverlayTrigger,
  Tooltip,
  useAccordionButton,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../utilities/AuthProvider";
import {
  patientItems,
  administrationItems,
} from "../../../utilities/constants";
import ArrowIcon from "../../arrow-icon";
import {
  RiFileList2Line,
  RiHome2Line,
  RiHomeGearLine,
  RiHospitalLine,
  RiListSettingsLine,
  RiListView,
  RiHealthBookLine,
} from "@remixicon/react";
import { permission } from "process";
import { checkPermission } from "../../../utilities/utility-function";

const VerticalNav = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(false);
  const [active, setActive] = useState("");
  const { userRoles, permissions } = useAuth();

  console.log(permissions);
  const CustomToggle = React.forwardRef(
    ({ children, eventKey, onClick, activeClass }, ref) => {
      console.log("activeClass", activeClass);

      const { activeEventKey } = useContext(AccordionContext);

      const decoratedOnClick = useAccordionButton(eventKey, (active) =>
        onClick({ state: !active, eventKey: eventKey })
      );

      const isCurrentEventKey = activeEventKey === eventKey;

      return (
        <Link
          ref={ref}
          to="#"
          aria-expanded={isCurrentEventKey ? "true" : "false"}
          className={`nav-link ${
            activeEventKey === eventKey || eventKey === active ? "active" : ""
          } ${activeClass === true ? "active" : ""}`}
          role="button"
          onClick={() => {
            decoratedOnClick(isCurrentEventKey);
          }}
        >
          {children}
        </Link>
      );
    }
  );

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
              key={"Dashboard"}
              placement={"right"}
              overlay={<Tooltip id="Dashboard">Dashboard</Tooltip>}
            >
              <span>
                <RiHome2Line />
              </span>
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
                <span>
                  <RiHospitalLine />
                </span>
              </OverlayTrigger>
              <span className="item-name">Clinics</span>
            </Link>
          </Nav.Item>
        )}
        {userRoles.includes("superadmin") && (
          <Nav.Item as="li">
            <Link
              to="/manage-forms"
              className={`nav-link ${
                location.pathname === "/manage-forms" ? "active" : ""
              }`}
            >
              <OverlayTrigger
                key={"Dashboard"}
                placement={"right"}
                overlay={<Tooltip id="Dashboard">Manage Forms</Tooltip>}
              >
                <span>
                  <RiListSettingsLine />
                </span>
              </OverlayTrigger>
              <span className="item-name">Manage Forms</span>
            </Link>
          </Nav.Item>
        )}

        {/* administration nav menu items */}
        {(checkPermission(permissions, [
          "administration:read",
          "administration:write",
        ]) ||
          userRoles?.includes("admin")) && (
          <Accordion bsPrefix="bg-none" onSelect={(e) => setActiveMenu(e)}>
            <Accordion.Item
              as="li"
              className={`nav-item ${active === "Administration" && "active"} ${
                location.pathname === "/administration/users-list" ||
                location.pathname === "/administration/add-user" ||
                location.pathname === "/administration/roles"
                  ? // location.pathname === "/administration/campaigns"
                    "active"
                  : ""
              }`}
              onClick={() => setActive("Administration")}
            >
              <div className="colors">
                <CustomToggle
                  eventKey="Administration"
                  activeClass={administrationItems.some(
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
                    <span>
                      <RiHomeGearLine />
                    </span>
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
                    {administrationItems.map(({ path, name, icon }) => (
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
        {((!userRoles?.includes("superadmin") &&
          checkPermission(permissions, ["queues:write", "queues:read"])) ||
          userRoles?.includes("admin")) && (
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
                <span>
                  <RiHealthBookLine />
                </span>
              </OverlayTrigger>
              <span className="item-name ">Queues </span>
            </Link>
          </Nav.Item>
        )}
        {((!userRoles?.includes("superadmin") &&
          checkPermission(permissions, ["camps:write", "camps:read"])) ||
          userRoles?.includes("admin")) && (
          <Nav.Item as="li">
            <Link
              to="/camps"
              className={`nav-link ${
                location.pathname.includes("/camps") ? "active" : ""
              }`}
            >
              <OverlayTrigger
                key={"Camps"}
                placement={"right"}
                overlay={<Tooltip id="Dashboard">All Camps</Tooltip>}
              >
                <span>
                  <RiListView />
                </span>
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
                <RiListView />
              </OverlayTrigger>
              <span className="item-name ">Form Templates </span>
            </Link>
          </Nav.Item>
        )} */}

        {/* patients management */}
        {((!userRoles?.includes("superadmin") &&
          checkPermission(permissions, ["patients:write", "patients:read"])) ||
          userRoles?.includes("admin")) && (
          <Accordion bsPrefix="bg-none" onSelect={(e) => setActiveMenu(e)}>
            <Accordion.Item
              as="li"
              className={`nav-item ${active === "Patient" && "active"}`}
              onClick={() => setActive("Patient")}
            >
              <div className="colors">
                <CustomToggle
                  eventKey="Patient"
                  activeClass={patientItems.some((item) =>
                    location.pathname.includes(item.path)
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={"Patient"}
                    placement={"right"}
                    overlay={<Tooltip id="Patient">Patient</Tooltip>}
                  >
                    <span>
                      <RiFileList2Line />
                    </span>
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
