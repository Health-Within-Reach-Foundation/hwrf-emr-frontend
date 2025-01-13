import React from "react";
import { Carousel, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const JoinUsCarousel = () => {
  return (
    <Col md={6} className="text-center z-2">
      <div className="sign-in-detail text-white">
        <Link to="/" className="sign-in-logo mb-2">
          <img
            src={generatePath("/assets/images/hwrf-logo.png")}
            className="img-fluid"
            alt="Logo"
          />
        </Link>
        <Carousel interval={2000} controls={false}>
          <Carousel.Item>
            <img
              src={generatePath("/assets/images/login/1.png")}
              // src={generatePath("/assets/images/login/login-carousel-1.jpg")}
              className="d-block w-100"
              alt="Slide 1"
            />
            <div className="carousel-caption-container">
              <h4 className="mb-1 mt-1 text-white">lorem ipsum 1</h4>
              <p className="pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem officiis, quia soluta eum eius iste doloremque tempore possimus minus aut porro, quasi esse cum necessitatibus magnam, nobis iure expedita eaque?
              </p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <img
              src={generatePath("/assets/images/login/2.png")}
              // src={generatePath("/assets/images/login/login-carousel-2.jpg")}
              className="d-block w-100"
              alt="Slide 2"
            />
            <div className="carousel-caption-container">
            <h4 className="mb-1 mt-1 text-white">lorem ipsum 2</h4>
              <p className="pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem officiis, quia soluta eum eius iste doloremque tempore possimus minus aut porro, quasi esse cum necessitatibus magnam, nobis iure expedita eaque?
              </p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <img
              src={generatePath("/assets/images/login/3.png")}
              // src={generatePath("/assets/images/login/login-carousel-3.jpg")}
              className="d-block w-100"
              alt="Slide 3"
            />
            <div className="carousel-caption-container">
            <h4 className="mb-1 mt-1 text-white">lorem ipsum 3</h4>
              <p className="pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem officiis, quia soluta eum eius iste doloremque tempore possimus minus aut porro, quasi esse cum necessitatibus magnam, nobis iure expedita eaque?
              </p>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </Col>
  );
};

export default JoinUsCarousel;
