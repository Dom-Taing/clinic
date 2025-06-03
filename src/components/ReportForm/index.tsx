import {
  Button,
  FormControl,
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

interface FormEntry {
  label: string;
  value: string;
}

export default function ReportForm() {
  const [formValue, setFormValue] = useState<FormEntry[]>([]);
  const [labelInput, setLabelInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  const handleAdd = () => {
    if (labelInput && valueInput) {
      const newEntry = { label: labelInput, value: valueInput };
      setFormValue((prev) => [...prev, newEntry]);
      setLabelInput("");
      setValueInput("");
    }
  };

  const handleDelete = (index: number) => {
    setFormValue((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormValue([]);
    setLabelInput("");
    setValueInput("");
  };

  const handleSubmit = async () => {
    try {
      const tableElement = document.getElementById("data-table");
      if (!tableElement) {
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

  return (
    <>
      <Paper elevation={2} sx={{ padding: 2, minWidth: 500, maxWidth: 1000 }}>
        <FormControl fullWidth>
          <Grid container spacing={2}>
            <Grid item xs={5}>
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
            <Grid item xs={5}>
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
            <Grid item xs={2} style={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                fullWidth
              >
                Add
              </Button>
            </Grid>
            <Grid item xs={12}>
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
              item
              xs={12}
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
        id="data-table"
        style={{
          backgroundColor: "white",
          fontSize: "2rem",
          minHeight: "200px",
          padding: "3rem",
          marginTop: "2rem",
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
            <span style={{ textAlign: "left" }}>{entry.value}</span>{" "}
          </div>
        ))}
      </div>
    </>
  );
}
