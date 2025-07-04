import { FormattedWorkTime, WorkTime } from "@/types/workTime";
import { calculateDuration } from "./calculateDuration";

export const formatWorkTimeData = (data: WorkTime[]) => {
  let formattedData: FormattedWorkTime[] = [];
  data.forEach((item) => {
    const existingItemIndex = formattedData.findIndex(
      (d) => d.userId === item.user_id
    );
    if (existingItemIndex !== -1) {
      if (item.type === "check_in") {
        formattedData[existingItemIndex].checkIn = item.time;
      } else if (item.type === "check_out") {
        formattedData[existingItemIndex].checkOut = item.time;
      }
    } else {
      formattedData.push({
        userName: item.User.name_kh,
        checkIn: item.type === "check_in" ? item.time : null,
        checkOut: item.type === "check_out" ? item.time : null,
        userId: item.user_id,
        duration: null, // Duration will be calculated later
      });
    }
  });
  formattedData = formattedData.map((entry) => {
    const duration =
      entry.checkIn && entry.checkOut
        ? calculateDuration(entry.checkIn, entry.checkOut)
        : null;
    return {
      ...entry,
      duration,
    };
  });
  return formattedData;
};
