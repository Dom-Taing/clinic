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

interface EditTimeProps {
  workTimeData: FormattedWorkTime[];
}

export default function EditTime({ workTimeData }: EditTimeProps) {
  const [loading, setLoading] = useState(false);
  const [isFormEnabled, setIsFormEnabled] = useState(true); // State to control form enable/disable
  const [checkInTime, setCheckInTime] = useState<Date | null>(null); // State to control the TimePicker
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null); // State to control the TimePicker
  const [doctor, setDoctor] = useState<string | null>("hello"); // State to control the selected doctor
  const [workTime, setWorkTime] = useState<FormattedWorkTime[]>(
    workTimeData || []
  );

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
