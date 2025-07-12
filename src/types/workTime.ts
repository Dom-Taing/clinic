export interface WorkTime {
  id: number;
  created_at: string; // ISO 8601 timestamp
  user_id: string; // UUID
  time: string; // ISO 8601 timestamp
  type: "check_in" | "check_out" | "duty"; // Enum for type
  User: {
    id: string; // UUID
    name_kh: string; // Khmer name
    clinic: string; // clinic id
  };
}

export interface FormattedWorkTime {
  userId: string;
  userName: string;
  type: "day" | "duty";
  checkIn: string | null; // ISO 8601 timestamp or null if no check-in
  checkOut: string | null; // ISO 8601 timestamp or null if no check-out
  duration: string | null; // Duration in "Xh Ym Zs" format
}
