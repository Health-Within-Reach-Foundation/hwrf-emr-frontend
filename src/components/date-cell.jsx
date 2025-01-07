import React from "react";
import { formatDate } from "../utilities/format-date";


const DateCell = ({
  date,
  showTime = false,
  className,
  dateClassName,
  timeClassName,
  dateFormat = "MMMM D, YYYY",
  timeFormat = "h:mm A",
}) => {
  return (
    <div className={`d-grid gap-1 ${className || ""}`}>
      <time
        dateTime={formatDate(date, "YYYY-MM-DD")}
        className={`fw-medium ${dateClassName || ""}`}
      >
        {formatDate(date, dateFormat)}
      </time>
      <time
        dateTime={formatDate(date, "HH:mm:ss")}
        className={`text-muted small ${timeClassName || ""} ${
          showTime ? "" : "d-none"
        }`}
      >
        {formatDate(date, timeFormat)}
      </time>
    </div>
  );
};

export default DateCell;
