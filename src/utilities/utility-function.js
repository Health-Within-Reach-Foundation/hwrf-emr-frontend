export const dentalQuadrant = (number) => {
  let textDentalQuadrant = "";
  switch (number) {
    case "1":
      textDentalQuadrant = "One";
      break;
    case "2":
      textDentalQuadrant = "Two";
      break;
    case "3":
      textDentalQuadrant = "Three";
      break;
    case "4":
      textDentalQuadrant = "Four";
      break;
    default:
      textDentalQuadrant = "";
      break;
  }

  return textDentalQuadrant;
};

export const transformText = (text) => {
  return text
    ?.replace(/_/g, " ") // Replace underscores with spaces
    ?.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};
