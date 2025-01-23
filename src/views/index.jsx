import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import Card from "../components/Card";
import DateCell from "../components/date-cell";
import { useAuth } from "../utilities/AuthProvider";
import campManagementService from "../api/camp-management-service";
import { Loading } from "../components/loading";
import clinicServices from "../api/clinic-services";
import CampModalForm from "../components/administration/camp-form";
import DynamicForm from "./form-templates/formRender";
import DynamicFields from "./form-templates/editableForm";
import { RiAddLine } from "@remixicon/react";

const Index = () => {
  const { user, initializeAuth, userRoles = [] } = useAuth();
  const carouselRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showCampForm, setShowCampForm] = useState(false);
  const [usersOptions, setUsersOptions] = useState([]);
  const [specialtiesOptions, setSpecialtiesOptions] = useState([]);

  const [campDetails, setCampDetails] = useState(() => {
    const activeCamps = user?.camps?.filter((camp) => camp.status === "active");

    return activeCamps?.length == 0
      ? null
      : activeCamps?.find((camp) => camp.id === user?.currentCampId) || null;
  });
  console.log(user);
  const getUsersbyClinic = async () => {
    setLoading(true);
    try {
      const response = await clinicServices.getUsersByClinic();
      const formattedUsers = response.data.map((user) => ({
        value: user?.id,
        label: user?.name,
        phoneNumber: user?.phoneNumber,
      }));
      setUsersOptions(formattedUsers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyDepartmentsByClinic = async () => {
    try {
      setLoading(true);
      const response = await clinicServices.getSpecialtyDepartmentsByClinic();
      setSpecialtiesOptions(
        response.data.map((department) => ({
          value: department.id,
          label: department.departmentName,
        }))
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (carouselRef.current) {
        setIsScrollable(
          carouselRef.current.scrollWidth > carouselRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [user?.camps]);

  useEffect(() => {
    getUsersbyClinic();
    getSpecialtyDepartmentsByClinic();
  }, []);
  const handleSelect = async (selectedCampId) => {
    if (selectedCampId) {
      setLoading(true);
      const response = await campManagementService.selectCamp(selectedCampId);

      if (response.success) {
        await initializeAuth();
      }
      setLoading(false);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const sortedCamps = user?.camps ? user.camps : [];
  // ? [...user.camps].sort((a, b) => {
  //     // Make the selected camp the first one in the list
  //     return a.id === user.currentCampId
  //       ? -1
  //       : b.id === user.currentCampId
  //       ? 1
  //       : 0;
  //   })

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {userRoles.includes("superadmin") ? (
        <>Dashboard</>
      ) : (
        <div className="camp-section">
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              justifySelf: "end",
            }}
          >
            <Button type="primary" onClick={() => setShowCampForm(true)}>
              <RiAddLine/>
              Create a Camp
            </Button>
          </div>

          <h3 className="mb-3">Active Camps</h3>
          <div className="carousel-wrapper position-relative">
            {isScrollable && (
              <Button
                variant="light"
                className="carousel-btn left-btn shadow"
                onClick={() => scrollCarousel("left")}
              >
                &#8249;
              </Button>
            )}
            <div
              ref={carouselRef}
              className="camp-carousel d-flex overflow-auto"
            >
              {sortedCamps.map((camp) => (
                <div
                  key={camp.id}
                  className={`camp-card ${
                    camp.id === user.currentCampId ? "highlighted-card" : ""
                  }`}
                  onClick={() => handleSelect(camp.id)}
                  role="button"
                >
                  <Card className="camp-card-body">
                    <Card.Body>
                      <div className="d-flex gap-2 mb-2">
                        <DateCell
                          date={camp.startDate}
                          dateFormat="D MMM, YYYY"
                        />{" "}
                        -
                        <DateCell
                          date={camp.endDate}
                          dateFormat="D MMM, YYYY"
                        />
                      </div>
                      <h5 className="mb-1">{camp?.name}</h5>
                      <p className="text-muted">{camp?.location}</p>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
            {isScrollable && (
              <Button
                variant="light"
                className="carousel-btn right-btn shadow"
                onClick={() => scrollCarousel("right")}
              >
                &#8250;
              </Button>
            )}
          </div>
        </div>
      )}

      {/* <CampSelectionModal
        open={
          campDetails === null &&
          !userRoles.includes("superadmin") &&
          !userRoles.includes("admin")
        }
        camps={user?.camps || []}
        onClose={() => {}}
        preCheckedCampId={null}
      /> */}

      {showCampForm && (
        <CampModalForm
          show={showCampForm}
          onClose={() => {
            initializeAuth();
            setShowCampForm(false);
          }}
          users={usersOptions} // Pass user options here
          specialties={specialtiesOptions} // Pass specialty options here
        />
      )}
      {/* <DynamicFields/> */}
    </>
  );
};

export default Index;
