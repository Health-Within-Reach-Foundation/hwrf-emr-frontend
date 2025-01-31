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


export function shortenFileName(input, startLength, endLength){
  // If the string is shorter than the combined lengths of start and end, return the string as is
  if (input?.length <= startLength + endLength) {
      return input;
  }

  // Get the first startLength characters and last endLength characters
  const start = input?.substring(0, startLength);
  const end = input?.substring(input?.length - endLength);

  // Return the shortened string with '...' in between
  return `${start}...${end}`;
}