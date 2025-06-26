import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import DataTable from "../DataTable";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toPng } from "html-to-image";
import axios from "axios";
import LoadingScreen from "../UI/LoadingScreen/LoadingScreen";
import { TimePicker } from "@mui/x-date-pickers";
import { set } from "date-fns";
import { FormattedWorkTime } from "@/types/workTime";
import { convertToDefault } from "@/utils/workTime/convertToTimeZone";
import { createClient } from "@supabase/supabase-js";
import { formatWorkTimeData } from "@/utils/workTime/formatWorkTime";
import { useSupabase } from "@/context/supabase";

interface EditTimeProps {
  workTimeData: FormattedWorkTime[];
}

export default function EditTime({ workTimeData }: EditTimeProps) {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);
  const [isFormEnabled, setIsFormEnabled] = useState(true); // State to control form enable/disable
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  ); // State to control the date field

  const [checkInTime, setCheckInTime] = useState<Date | null>(null); // State to control the TimePicker
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null); // State to control the TimePicker
  const [doctor, setDoctor] = useState<string | null>("hello"); // State to control the selected doctor
  const [workTime, setWorkTime] = useState<FormattedWorkTime[]>(
    workTimeData || []
  );

  useEffect(() => {
    const fetchWorkTime = async () => {
      setLoading(true);
      try {
        // convert user selected date from their timezone to UTC format
        const selectedDate = new Date(date);
        const startTime = selectedDate.toISOString();

        selectedDate.setDate(selectedDate.getDate() + 1); // Set to the next day to include the whole day
        const endTime = selectedDate.toISOString();

        const { data, error } = await supabase
          .from("work_time") // Replace with your table name
          .select("*")
          .gte("time", startTime)
          .lte("time", endTime);

        console.log("Fetched work time data:", data);
        console.log("Error fetching work time data:", error);

        // setWorkTime(formatData || []);
      } catch (error) {
        console.error("Error fetching work time data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkTime();
  }, [date]);

  return (
    <>
      <LoadingScreen isOn={loading} />
      <Paper
        elevation={2}
        sx={{ padding: 2, minWidth: 500, maxWidth: 1000, marginBottom: 4 }}
      >
        <FormControl fullWidth>
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}>
              <TextField
                id="date-field"
                label={"Date"}
                fullWidth
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                name="date"
                value={date}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 8 }}></Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                label="Doctor"
                fullWidth
                value={doctor}
                onChange={(event) => {
                  setDoctor(event.target.value);
                }}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TimePicker
                label="Check In"
                value={checkInTime}
                onChange={(newValue) => setCheckInTime(newValue)}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TimePicker
                label="Check Out"
                value={checkOutTime}
                onChange={(newValue) => setCheckOutTime(newValue)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DataTable
                header={[
                  { display: "Doctor", key: "doctorName" },
                  { display: "Check In Time", key: "checkIn" },
                  { display: "Check Out Time", key: "checkOut" },
                  { display: "Edit", key: "edit" },
                  { display: "Delete", key: "delete" },
                ]}
                data={workTime.map((item) => ({
                  doctorName: item.userName,
                  checkIn: convertToDefault(item.checkIn),
                  checkOut: convertToDefault(item.checkOut),
                  edit: (
                    <IconButton
                      onClick={() => {
                        // Handle edit logic here
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  ),
                  delete: (
                    <IconButton
                      onClick={() => {
                        setWorkTime((prev) =>
                          prev.filter((w) => w.userId !== item.userId)
                        );
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  ),
                }))}
              />
            </Grid>
          </Grid>
        </FormControl>
      </Paper>
    </>
  );
}
