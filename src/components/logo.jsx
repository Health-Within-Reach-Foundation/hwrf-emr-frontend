import React from "react"

// Import Image

const generatePath = (path) => {
    return window.origin + import.meta.env.BASE_URL + path;
  };

const Logo = () => {
    return (
        <>
            <div className="logo-main">
                <img className="logo-normal img-fluid  mb-3 scale-125" src={generatePath("/assets/images/HWRF Vertical.svg")} height="30" alt="logo" />{" "}
                <span className="ms-2 brand-name">HWRF</span>
            </div>
        </>
    )
}

export default Logo