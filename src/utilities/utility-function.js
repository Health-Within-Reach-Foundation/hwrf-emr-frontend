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

export function shortenFileName(input, startLength, endLength) {
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

export function formatRegisterNumberOfPatient(patient) {
  console.log(patient);
  const year = new Date(patient.createdAt)?.getFullYear() % 100; // Get last two digits of year
  const month = new Date(patient.createdAt)?.getMonth() + 1; // Months are zero-based in JS
  let financialYear;
  if (month > 3) {
    financialYear = `${year}-${year + 1}`;
  } else {
    financialYear = `${year - 1}-${year}`;
  }

  return `HWRF/${financialYear}/${patient.regNo}`;
}

// create the function to calculate the bmi based on weiht in kg and height in feet and inch for example 5.11

export function calculateBMI(weight, heightFeet) {
  if (weight && heightFeet) {
    const heightParts = heightFeet.toString().split(".");
    const feet = parseInt(heightParts[0], 10);
    const inches = heightParts[1] ? parseInt(heightParts[1], 10) : 0;
    const height = feet * 0.3048 + inches * 0.0254; // Convert height to meters
    return (weight / (height * height)).toFixed(2);
  }
  return null;
}

// here perissions is array of permission associated to the user role and permission is the array which is requrired to check if any of the permission is present in the permissions array the return true else return false
export function checkPermission(permissions, requriredPermission = []) {
  const formattedPermission = permissions?.map(
    (permission) => permission?.action
  );
  return requriredPermission?.some((p) => formattedPermission?.includes(p));
}
