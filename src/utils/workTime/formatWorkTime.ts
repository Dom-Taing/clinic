import { FormattedWorkTime, WorkTime } from "@/types/workTime";
import { calculateDuration } from "./calculateDuration";

export const formatWorkTimeData = (data: WorkTime[]) => {
  let formattedData: FormattedWorkTime[] = [];
  let dutydata: FormattedWorkTime[] = [];
  data.forEach((item) => {
    const existingItemIndex = formattedData.findIndex(
      (d) => d.userId === item.user_id
    );
    if (item.type === "duty") {
      const dutyTime = new Date(item.time);
      const ICTTime = new Date(dutyTime.getTime() + 7 * 60 * 60 * 1000); // Convert to ICT (UTC+7)
      const dutyCheckIn = new Date(
        Date.UTC(
          ICTTime.getUTCFullYear(),
          ICTTime.getUTCMonth(),
          ICTTime.getUTCDate(),
          19 - 7, // 7 pm ICT
          30 // 30 minutes
        )
      );
      const dutyCheckOut = new Date(
        Date.UTC(
          ICTTime.getUTCFullYear(),
          ICTTime.getUTCMonth(),
          ICTTime.getUTCDate() + 1,
          7 - 7, // 7 am ICT
          30 // 30 minutes
        )
      );
      dutydata.push({
        type: "duty",
        userName: item.User.name_kh,
        checkIn: dutyCheckIn.toISOString(),
        checkOut: dutyCheckOut.toISOString(),
        userId: item.user_id,
        duration: null, // Duration will be calculated later
      });
      return;
    }
    if (existingItemIndex !== -1) {
      if (item.type === "check_in") {
        formattedData[existingItemIndex].checkIn = item.time;
      } else if (item.type === "check_out") {
        formattedData[existingItemIndex].checkOut = item.time;
      }
    } else {
      formattedData.push({
        type: "day",
        userName: item.User.name_kh,
        checkIn: item.type === "check_in" ? item.time : null,
        checkOut: item.type === "check_out" ? item.time : null,
        userId: item.user_id,
        duration: null, // Duration will be calculated later
      });
    }
  });
  formattedData = formattedData.map((entry) => {
    const haveDuty = dutydata.find((item) => item.userId === entry.userId);
    const dutyCheckInTime = haveDuty?.checkIn;
    const checkOutTime = dutyCheckInTime ? dutyCheckInTime : entry.checkOut;
    return {
      ...entry,
      checkOut: checkOutTime,
    };
  });
  formattedData = formattedData.concat(dutydata).map((entry) => {
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
