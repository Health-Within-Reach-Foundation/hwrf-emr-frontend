import React, { useState } from "react";
import "./teeth-selector.scss";

const teethPositions = [
  // Upper Right (Quadrant 1)
  { id: 11, top: "19%", left: "48%" },
  { id: 12, top: "21%", left: "54%" },
  { id: 13, top: "24%", left: "60%" },
  { id: 14, top: "28%", left: "63%" },
  { id: 15, top: "32%", left: "65%" },
  { id: 16, top: "36.5%", left: "67%" },
  { id: 17, top: "41%", left: "68%" },
  { id: 18, top: "45%", left: "69%" },

  // Upper Left (Quadrant 2)
  { id: 21, top: "19%", left: "39%" },
  { id: 22, top: "21%", left: "32.5%" },
  { id: 23, top: "24%", left: "27%" },
  { id: 24, top: "28%", left: "23%" },
  { id: 25, top: "32.4%", left: "21%" },
  { id: 26, top: "37%", left: "19%" },
  { id: 27, top: "41%", left: "19%" },
  { id: 28, top: "46%", left: "19%" },

  // Lower Right (Quadrant 4)
  { id: 41, top: "16%", left: "48%" },
  { id: 42, top: "16.5%", left: "43%" },
  { id: 43, top: "18%", left: "37%" },
  { id: 44, top: "21.5%", left: "32%" },
  { id: 45, top: "26%", left: "29%" },
  { id: 46, top: "31%", left: "27%" },
  { id: 47, top: "35%", left: "24.8%" },
  { id: 48, top: "40%", left: "24%" },

  // Lower Left (Quadrant 3)
  { id: 31, top: "16%", left: "53%" },
  { id: 32, top: "16.5%", left: "59%" },
  { id: 33, top: "18%", left: "65%" },
  { id: 34, top: "21.5%", left: "69%" },
  { id: 35, top: "26%", left: "71%" },
  { id: 36, top: "31%", left: "73%" },
  { id: 37, top: "35%", left: "75%" },
  { id: 38, top: "40%", left: "76%" },
];

const TeethSelector = () => {
  const [selectedTeeth, setSelectedTeeth] = useState([]);

  const handleSelect = (id) => {
    setSelectedTeeth((prev) =>
      prev.includes(id) ? prev.filter((tooth) => tooth !== id) : [...prev, id]
    );
  };

  return (
    <div className="adult-teeth-selector" id='adult'>
      <div className="adult-teeth-image">
        {teethPositions.map((tooth) =>
          tooth.id > 30 ? (
            <button
              key={tooth.id}
              className={`adult-tooth-button ${
                selectedTeeth.includes(tooth.id) ? "adult-selected" : ""
              }`}
              style={{ bottom: tooth.top, left: tooth.left }}
              onClick={() => handleSelect(tooth.id)}
            >
              {tooth.id}
            </button>
          ) : (
            <button
              key={tooth.id}
              className={`adult-tooth-button ${
                selectedTeeth.includes(tooth.id) ? "adult-selected" : ""
              }`}
              style={{ top: tooth.top, right: tooth.left }}
              onClick={() => handleSelect(tooth.id)}
            >
              {tooth.id}
            </button>
          )
        )}
      </div>
      <div className="adult-selected-teeth">
        <h4>Selected Teeth:</h4>
        <p>{selectedTeeth.length > 0 ? selectedTeeth.join(", ") : "None"}</p>
      </div>
    </div>
  );
};

export default TeethSelector;
