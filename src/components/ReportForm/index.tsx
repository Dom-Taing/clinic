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
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { toPng } from "html-to-image";
import ReactDOM from "react-dom";
import axios from "axios";
import { medicineList, translation } from "./config";
import doc from "pdfkit";

interface FormEntry {
  label: string;
  value: string;
}

interface ReportFormProps {
  doctorList: string[];
}

export default function ReportForm({ doctorList }: ReportFormProps) {
  const [formValue, setFormValue] = useState<FormEntry[]>([
    { label: translation.general, value: "0" },
    { label: translation.worker, value: "0" },
    { label: translation.government, value: "0" },
    { label: translation.selfEmployed, value: "0" },
    { label: translation.workInjury, value: "0" },
    { label: translation.stayIn, value: "0" },
    { label: translation.total, value: "0" },
    { label: translation.moneyTotal, value: "0" },
    { label: translation.picture, value: "0" },
    ...medicineList.map((medicine) => ({
      label: medicine,
      value: "0",
    })),
  ]);
  const [doctorForm, setDoctorForm] = useState<FormEntry[]>([]);
  const [labelInput, setLabelInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [doctorInput, setDoctorInput] = useState("");
  const [doctorValue, setDoctorValue] = useState("");

  const [scan, setScan] = useState(false);

  const handleAdd = () => {
    if (labelInput && valueInput) {
      const newEntry = { label: labelInput, value: valueInput };
      setFormValue((prev) => [...prev, newEntry]);
      setLabelInput("");
      setValueInput("");
    }
  };

  const handleAddDoctor = () => {
    if (doctorInput && doctorValue) {
      const newEntry = { label: doctorInput, value: doctorValue };
      setDoctorForm((prev) => [...prev, newEntry]);
      setDoctorInput("");
      setDoctorValue("");
    }
  };

  const handleDelete = (index: number) => {
    setFormValue((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormValue([
      { label: translation.general, value: "0" },
      { label: translation.worker, value: "0" },
      { label: translation.government, value: "0" },
      { label: translation.selfEmployed, value: "0" },
      { label: translation.workInjury, value: "0" },
      { label: translation.stayIn, value: "0" },
      { label: translation.total, value: "0" },
      { label: translation.moneyTotal, value: "0" },
      { label: translation.picture, value: "0" },
      ...medicineList.map((medicine) => ({
        label: medicine,
        value: "0",
      })),
    ]);
    setLabelInput("");
    setValueInput("");
    setDoctorInput("");
    setDoctorValue("");
    setScan(false);
  };

  const handleSubmit = async () => {
    try {
      const tableElement = document.getElementById("data-table");
      if (!tableElement || formValue.length === 0) {
        console.error("Table element not found");
        return;
      }

      // Convert the table to an image
      const image = await toPng(tableElement);

      // Convert Base64 to Blob
      const byteString = atob(image.split(",")[1]);
      const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
      const arrayBuffer = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: mimeString });

      // Create FormData to send as multipart/form-data
      const formData = new FormData();
      const chatId = process.env.NEXT_PUBLIC_CHAT_ID || "YOUR_CHAT_ID"; // Replace with your chat ID
      formData.append("chat_id", chatId); // Replace with your chat ID
      formData.append("photo", blob, "table-image.png"); // Attach the image
      formData.append("caption", "Here is the table data");

      // Send the image to Telegram
      const telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendPhoto`;

      await axios.post(telegramApiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log("Error generating image or sending to Telegram:", error);
      console.log("error");
    }
  };

  const updateFormValue = (label: string, value: string) => {
    setFormValue((prev) => {
      const entryExists = prev.some((entry) => entry.label === label);

      if (entryExists) {
        // Update the existing entry
        return prev.map((entry) =>
          entry.label === label ? { ...entry, value } : entry
        );
      } else {
        // Add a new entry
        return [...prev, { label, value }];
      }
    });
  };

  const updateScan = (value: boolean) => {
    if (value) {
      const removed = formValue.filter((entry) => entry.label !== "នៅសល់");
      setFormValue(removed);
    } else {
      setFormValue((prev) => {
        const existingEntry = prev.find((entry) => entry.label === "នៅសល់");
        if (existingEntry) {
          return prev.map((entry) =>
            entry.label === "នៅសល់" ? { ...entry, value: "0" } : entry
          );
        } else {
          return [...prev, { label: "នៅសល់", value: "0" }];
        }
      });
    }
    setScan(value);
  };

  const getUnit = (label: string) => {
    if (label === "Eva" || label === "Meuri") {
      return "ប្រអប់";
    } else if (label === translation.moneyTotal) {
      return "៛";
    }
    return "នាក់";
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{ padding: 2, minWidth: 500, maxWidth: 1000, marginBottom: 4 }}
      >
        <FormControl fullWidth>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <h2>Report Form</h2>
            </Grid>
            {Object.keys(translation).map((key) => (
              <Grid size={{ xs: 3 }} key={key}>
                <TextField
                  type="number"
                  label={translation[key as keyof typeof translation]}
                  fullWidth
                  name={translation[key as keyof typeof translation]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const name = e.target.name;
                    let value = e.target.value;
                    value = value.replace(/^0+/, "") || "";
                    e.target.value = value;
                    updateFormValue(name, value || "0");
                  }}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                />
              </Grid>
            ))}
            <Grid size={{ xs: 12 }}>
              <h3>Medicine</h3>
            </Grid>
            {medicineList.map((medicine) => (
              <Grid size={{ xs: 3 }} key={medicine}>
                <TextField
                  type="number"
                  label={medicine}
                  fullWidth
                  name={medicine}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const name = e.target.name;
                    let value = e.target.value;
                    value = value.replace(/^0+/, "") || "";
                    e.target.value = value;
                    updateFormValue(name, value || "0");
                  }}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                />
              </Grid>
            ))}
            <Grid size={{ xs: 12 }}>
              <h3>Doctor</h3>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <Autocomplete
                disablePortal
                options={doctorList} // Replace with actual doctor list
                // freeSolo
                value={doctorInput}
                onChange={(e, newValue) => {
                  setDoctorInput(newValue || "");
                }}
                autoSelect
                renderInput={(params) => (
                  <TextField {...params} label={"doctor"} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                type="number"
                label="Enter Value"
                variant="outlined"
                fullWidth
                value={doctorValue}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/^0+/, "") || "";
                  e.target.value = value;
                  setDoctorValue(value);
                }}
              />
            </Grid>
            <Grid
              size={{ xs: 2 }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddDoctor}
                fullWidth
              >
                Add
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <h3>Other Entries</h3>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                label="Enter Label"
                variant="outlined"
                fullWidth
                value={labelInput}
                onChange={(e) => {
                  setLabelInput(e.target.value);
                }}
              />
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                label="Enter Value"
                variant="outlined"
                fullWidth
                value={valueInput}
                onChange={(e) => {
                  setValueInput(e.target.value);
                }}
              />
            </Grid>
            <Grid
              size={{ xs: 2 }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                fullWidth
              >
                Add
              </Button>
            </Grid>
            <Grid size={{ xs: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={scan}
                    onChange={() => {
                      updateScan(!scan);
                    }}
                    color="primary" // Optional: Set the color
                  />
                }
                label="Scan"
              />
            </Grid>
            <Grid size={{ xs: 11 }}>
              {scan ? null : (
                <TextField
                  type="number"
                  label={"នៅសល់"}
                  fullWidth
                  name={"នៅសល់"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const name = e.target.name;
                    let value = e.target.value;
                    value = value.replace(/^0+/, "") || "";
                    e.target.value = value;
                    updateFormValue(name, value || "0");
                  }}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DataTable
                header={[
                  { display: "label", key: "label" },
                  { display: "value", key: "value" },
                  { display: "action", key: "action" },
                ]}
                data={formValue.map((entry, index) => ({
                  label: entry.label,
                  value: entry.value,
                  action: (
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ),
                }))}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
              }}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button variant="contained" color="secondary" onClick={resetForm}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </Paper>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          backgroundColor: "white",
        }}
      >
        <div
          id="data-table"
          style={{
            backgroundColor: "white",
            fontSize: "2rem",
            minHeight: "200px",
            padding: "3rem",
          }}
        >
          {formValue.map((entry, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr", // Define three columns: left, middle, right
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={{ textAlign: "left" }}>{entry.label}</span>{" "}
              <span>:</span>
              <span style={{ textAlign: "left" }}>
                {entry.value}
                {getUnit(entry.label)}
              </span>{" "}
            </div>
          ))}
          {scan && <div>ស្កេនរួច</div>}
        </div>
        <div
          id="data-table"
          style={{
            backgroundColor: "white",
            fontSize: "2rem",
            minHeight: "200px",
            padding: "3rem",
          }}
        >
          {doctorForm.map((entry, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr", // Define three columns: left, middle, right
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={{ textAlign: "left" }}>Dr.{entry.label}</span>{" "}
              <span>:</span>
              <span style={{ textAlign: "left" }}>
                {entry.value}
                {getUnit(entry.label)}
              </span>{" "}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
