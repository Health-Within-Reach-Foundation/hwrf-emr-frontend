import React, { useEffect, useState } from "react";
import "./teeth-selector.scss";

const teethPositions = [
  // Upper Right (Quadrant 1)
  { id: 11, top: "3.5%", left: "48%" },
  { id: 12, top: "5.2%", left: "54.5%" },
  { id: 13, top: "9.5%", left: "60%" },
  { id: 14, top: "16%", left: "64%" },
  { id: 15, top: "23%", left: "67%" },
  { id: 16, top: "29.8%", left: "68.5%" },
  { id: 17, top: "37%", left: "69%" },
  { id: 18, top: "45%", left: "69%" },

  // Upper Left (Quadrant 2)
  { id: 21, top: "3.8%", left: "39%" },
  { id: 22, top: "5.4%", left: "32.5%" },
  { id: 23, top: "10%", left: "26%" },
  { id: 24, top: "16%", left: "22%" },
  { id: 25, top: "22%", left: "20%" },
  { id: 26, top: "28.8%", left: "18%" },
  { id: 27, top: "36%", left: "18%" },
  { id: 28, top: "44%", left: "17.8%" },

  // Lower Right (Quadrant 4)
  { id: 41, top: "-2%", left: "48%" },
  { id: 42, top: "-1.2%", left: "41.4%" },
  { id: 43, top: "1.9%", left: "35.5%" },
  { id: 44, top: "7.9%", left: "31%" },
  { id: 45, top: "14%", left: "28.8%" },
  { id: 46, top: "20%", left: "26.5%" },
  { id: 47, top: "28.4%", left: "24.8%" },
  { id: 48, top: "35%", left: "24%" },

  // Lower Left (Quadrant 3)
  { id: 31, top: "-2%", left: "53.8%" },
  { id: 32, top: "-0.9%", left: "60%" },
  { id: 33, top: "2.5%", left: "65%" },
  { id: 34, top: "7.8%", left: "69%" },
  { id: 35, top: "14%", left: "72%" },
  { id: 36, top: "20.5%", left: "74%" },
  { id: 37, top: "28%", left: "76%" },
  { id: 38, top: "35%", left: "76.5%" },
];

// const TeethSelector = () => {
//   const [selectedTeeth, setSelectedTeeth] = useState([]);

//   const handleSelect = (id) => {
//     setSelectedTeeth((prev) =>
//       prev.includes(id) ? prev.filter((tooth) => tooth !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="adult-teeth-selector" id='adult'>
//       <div className="adult-teeth-image">
//         {teethPositions.map((tooth) =>
//           tooth.id > 30 ? (
//             <button
//               key={tooth.id}
//               className={`adult-tooth-button ${
//                 selectedTeeth.includes(tooth.id) ? "adult-selected" : ""
//               }`}
//               style={{ bottom: tooth.top, left: tooth.left }}
//               onClick={() => handleSelect(tooth.id)}
//             >
//               {tooth.id}
//             </button>
//           ) : (
//             <button
//               key={tooth.id}
//               className={`adult-tooth-button ${
//                 selectedTeeth.includes(tooth.id) ? "adult-selected" : ""
//               }`}
//               style={{ top: tooth.top, right: tooth.left }}
//               onClick={() => handleSelect(tooth.id)}
//             >
//               {tooth.id}
//             </button>
//           )
//         )}
//       </div>
//       <div className="adult-selected-teeth">
//         <h4>Selected Teeth:</h4>
//         <p>{selectedTeeth.length > 0 ? selectedTeeth.join(", ") : "None"}</p>
//       </div>
//     </div>
//   );
// };

const TeethSelector = ({ selectedTeeth = [], onChange, isEdit = false }) => {
  // console.log("teeth state -->", teethState);
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
    <div className="adult-teeth-selector" id="adult">
      <div className="adult-teeth-image">
        {teethPositions.map((tooth) =>
          tooth.id > 30 ? (
            <button
              // disabled={isEdit}
              key={tooth.id}
              className={`adult-tooth-button ${
                teethState?.includes(tooth.id) ? "adult-selected" : ""
              }`}
              style={{
                bottom: tooth.top,
                left: tooth.left,
                // cursor: isEdit ? "not-allowed" : "pointer",
              }}
              onClick={(e) => {
                e.preventDefault(); // Prevent any default behavior
                handleSelect(tooth.id);
              }}
            >
              {tooth.id}
            </button>
          ) : (
            <button
              // disabled={isEdit}
              key={tooth.id}
              className={`adult-tooth-button ${
                teethState?.includes(tooth.id) ? "adult-selected" : ""
              }`}
              style={{
                top: tooth.top,
                right: tooth.left,
                // cursor: isEdit ? "not-allowed" : "pointer",
              }}
              onClick={(e) => {
                e.preventDefault(); // Prevent any default behavior
                handleSelect(tooth.id);
              }}
            >
              {tooth.id}
            </button>
          )
        )}
      </div>
      {/* <div className="adult-selected-teeth">
        <h4>Selected Teeth:</h4>
        <p>{teethState.length > 0 ? teethState.join(", ") : "None"}</p>
      </div> */}
    </div>
  );
};

export default TeethSelector;
