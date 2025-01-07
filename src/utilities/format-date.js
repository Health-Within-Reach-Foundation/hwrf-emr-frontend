import dayjs from "dayjs";

export function formatDate(date, format) {
  if (!date) return "";
  return dayjs(date).format(format);
}
