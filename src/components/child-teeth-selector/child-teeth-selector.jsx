import React, { useEffect, useState } from "react";
import "./child-teeth-selector.scss";

const teethPositions = [
  // Upper Right (Quadrant 5)
  { id: 51, top: "26%", left: "48%" },
  { id: 52, top: "27%", left: "58%" },
  { id: 53, top: "31%", left: "64%" },
  { id: 54, top: "38%", left: "71%" },
  { id: 55, top: "45%", left: "74%" },

  // Upper Left (Quadrant 6)
  { id: 61, top: "26%", left: "41%" },
  { id: 62, top: "28%", left: "32%" },
  { id: 63, top: "32.5%", left: "25%" },
  { id: 64, top: "38%", left: "20%" },
  { id: 65, top: "45%", left: "17%" },

  // Lower Right (Quadrant 7)
  { id: 71, top: "23%", left: "42%" },
  { id: 72, top: "24%", left: "35%" },
  { id: 73, top: "29%", left: "26%" },
  { id: 74, top: "35%", left: "20%" },
  { id: 75, top: "41%", left: "18%" },

  // Lower Left (Quadrant 8)
  { id: 81, top: "23%", left: "49%" },
  { id: 82, top: "24%", left: "56%" },
  { id: 83, top: "29%", left: "65%" },
  { id: 84, top: "35%", left: "70%" },
  { id: 85, top: "41%", left: "73%" },
];

const ChildTeethSelector = ({
  selectedTeeth = [],
  onChange,
  isEdit = false,
}) => {
  const [teethState, setTeethState] = useState(selectedTeeth);

  useEffect(() => {
    setTeethState(selectedTeeth); // Sync with external state
  }, [selectedTeeth]);

  // const handleSelect = (id) => {
  //   const updatedTeeth = teethState?.includes(id)
  //     ? teethState?.filter((tooth) => tooth !== id)
  //     : [...teethState, id];

  //   setTeethState(updatedTeeth);
  //   if (onChange) onChange(updatedTeeth); // Notify parent about changes
  // };

  const handleSelect = (id) => {
    let updatedTeeth;

    if (isEdit) {
      // Allow only one tooth selection in edit mode
      updatedTeeth = [id];
    } else {
      // Toggle the selection for multiselect mode
      updatedTeeth = teethState.includes(id)
        ? teethState.filter((tooth) => tooth !== id)
        : [...teethState, id];
    }

    setTeethState(updatedTeeth);
    if (onChange) onChange(updatedTeeth); // Notify parent about changes
  };

  return (
    <div className="child-teeth-selector" id="child">
      <div className="child-teeth-image">
        {teethPositions.map((tooth) =>
          tooth.id > 70 ? (
            <button
              key={tooth.id}
              className={`child-tooth-button ${
                teethState?.includes(tooth.id) ? "child-selected" : ""
              }`}
              style={{
                bottom: tooth.top,
                right: tooth.left,
                // cursor: isEdit ? "not-allowed" : "pointer",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(tooth.id);
              }}
            >
              {tooth.id}
            </button>
          ) : (
            <button
              key={tooth.id}
              className={`child-tooth-button ${
                teethState?.includes(tooth.id) ? "child-selected" : ""
              }`}
              style={{
                top: tooth.top,
                right: tooth.left,
                // cursor: isEdit ? "not-allowed" : "pointer",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(tooth.id);
              }}
            >
              {tooth.id}
            </button>
          )
        )}
      </div>
      {/* <div className="child-selected-teeth">
        <h4>Selected Teeth:</h4>
        <p>{teethState.length > 0 ? teethState.join(", ") : "None"}</p>
      </div> */}
    </div>
  );
};

export default ChildTeethSelector;
