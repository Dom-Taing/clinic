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
import axios from "axios";
import LoadingScreen from "../UI/LoadingScreen/LoadingScreen";

interface DoctorEntry {
  doctorName: string;
  numPatient: string;
  nightPatient: string;
}

interface DoctorData {
  id: string;
  name: string;
}

interface ReportFormProps {
  doctorList: DoctorData[];
  clinic: string;
}

export default function ReportFormTest({
  doctorList,
  clinic,
}: ReportFormProps) {
  const [formState, setFormState] = useState({
    date: new Date().toLocaleDateString("en-CA"), // Format as YYYY-MM-DD
    insuredPatient: "",
    worker: "",
    government: "",
    dependent: "",
    workplaceIncident: "",
    insuredStayOver: "",
    general: "",
    generalStayOver: "",
    income: "",
    ABA: "",
    Echo: "",
    Eva: "",
    Meuri: "",
    picture: "",
    scan: "",
  });
  const [doctorEntries, setDoctorEntries] = useState<DoctorEntry[]>([]);
  const [doctorForm, setDoctorForm] = useState<DoctorEntry>({
    doctorName: "",
    numPatient: "",
    nightPatient: "",
  });
  const [scan, updateScan] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value, // Update the specific field in the state
    }));
  };

  const resetForm = () => {
    setFormState({
      date: "",
      insuredPatient: "",
      worker: "",
      government: "",
      dependent: "",
      workplaceIncident: "",
      insuredStayOver: "",
      general: "",
      generalStayOver: "",
      income: "",
      ABA: "",
      Echo: "",
      Eva: "",
      Meuri: "",
      picture: "",
      scan: "",
    });
  };

  const handleAddDoctor = () => {
    const newEntry: DoctorEntry = {
      doctorName: doctorForm.doctorName,
      numPatient: doctorForm.numPatient,
      nightPatient: doctorForm.nightPatient,
    };
    setDoctorEntries((prevEntries) => [...prevEntries, newEntry]);
    setDoctorForm({ doctorName: "", numPatient: "", nightPatient: "" }); // Reset the form after adding
  };

  const handleDeleteDoctor = (index: number) => {
    setDoctorEntries((prevEntries) =>
      prevEntries.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await document.fonts.ready;
      const tableElement = document.getElementById("report-form");
      if (!tableElement) {
        console.error("Table element not found");
        return;
      }

      // Validate form data
      if (
        doctorEntries.reduce(
          (acc, entry) => acc + parseInt(entry.numPatient || "0", 10),
          0
        ) !== parseInt(formState.insuredPatient || "0", 10)
      ) {
        alert("ចំនួនអ្នកជំងឺមិនត្រូវគ្នា។");
        return;
      }

      const entriesToInsert = doctorEntries.map((entry) => ({
        doctor_name: entry.doctorName,
        total_patient: entry.numPatient || "0",
        night_patient: entry.nightPatient || "0",
        user_id: doctorList.find((doctor) => doctor.name === entry.doctorName)
          ?.id,
        date: formState.date, // Include the date in each entry
      }));

      const response = await axios.post("/api/report", {
        entriesToInsert,
      });
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
      alert("Error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingScreen isOn={loading} />
      <Paper
        elevation={2}
        sx={{ padding: 2, minWidth: 500, maxWidth: 1000, marginBottom: 4 }}
      >
        <FormControl fullWidth>
          <Grid container spacing={2}>
            {/** Date Section */}
            <Grid item xs={12}>
              <h2>Date</h2>
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formState.date}
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                name="date"
                onChange={handleInputChange} // Update state on change
              />
            </Grid>
            {/** ជំងឺប.ស.ស Section */}
            <Grid item xs={12}>
              <h2>ជំងឺប.ស.ស</h2>
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="ជំងឺប.ស.ស"
                fullWidth
                name="insuredPatient"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="កម្មករ"
                fullWidth
                name="worker"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="មន្ត្រី"
                fullWidth
                name="government"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="ស្វ័យនិយោជន៍"
                fullWidth
                name="dependent"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="គ្រោះថ្នាក់ការងារ"
                fullWidth
                name="workplaceIncident"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="សំរាកពេទ្យ"
                fullWidth
                name="insuredStayOver"
                onChange={handleInputChange}
              />
            </Grid>
            {/** ជំងឺទូទៅ Section */}
            <Grid item xs={12}>
              <h2>ជំងឺទូទៅ</h2>
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="ជំងឺទូទៅ"
                fullWidth
                name="general"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="ដេកពេទ្យ"
                fullWidth
                name="generalStayOver"
                onChange={handleInputChange}
              />
            </Grid>
            {/** ចំណូល Section */}
            <Grid item xs={12}>
              <h2>ចំណូល</h2>
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="ចំណូល"
                fullWidth
                name="income"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="ABA"
                fullWidth
                name="ABA"
                onChange={handleInputChange}
              />
            </Grid>
            {/** គ្រូពេទ្យ Section */}
            <Grid item xs={12}>
              <h2>គ្រូពេទ្យ</h2>{" "}
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                disablePortal
                options={doctorList.map((doctor) => doctor.name)}
                autoSelect
                value={doctorForm.doctorName}
                onChange={(e, newValue) => {
                  setDoctorForm((prev) => ({
                    ...prev,
                    doctorName: newValue || "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label={"doctor"} />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="Number of Patients"
                variant="outlined"
                fullWidth
                value={doctorForm.numPatient}
                onChange={(e) =>
                  setDoctorForm((prev) => ({
                    ...prev,
                    numPatient: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="Night Patients"
                variant="outlined"
                fullWidth
                value={doctorForm.nightPatient}
                onChange={(e) =>
                  setDoctorForm((prev) => ({
                    ...prev,
                    nightPatient: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={2} style={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddDoctor}
              >
                Add
              </Button>
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="Echo"
                fullWidth
                name="Echo"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="Eva"
                fullWidth
                name="Eva"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="Meuri"
                fullWidth
                name="Meuri"
                onChange={handleInputChange}
              />
            </Grid>
            {/** ស្កេនមេដៃអត់ជាប់ (រូបថត) Section */}
            <Grid item xs={12}>
              <h2>ស្កេនមេដៃអត់ជាប់ (រូបថត)</h2>
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="ស្កេនមេដៃអត់ជាប់ (រូបថត)"
                fullWidth
                name="picture"
                onChange={handleInputChange}
              />
            </Grid>
            {/** ស្កេន Section */}
            <Grid item xs={12}>
              <h2>ស្កេន</h2>
            </Grid>
            <Grid item xs={2}>
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
                label="ស្កេនរួច"
              />
            </Grid>
            <Grid item xs={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!scan}
                    onChange={() => {
                      updateScan(!scan);
                    }}
                    color="primary"
                  />
                }
                label="សល់"
              />
            </Grid>
            {!scan && (
              <Grid item xs={3}>
                <TextField
                  type="number"
                  label="ស្កេន"
                  fullWidth
                  name="scan"
                  onChange={handleInputChange}
                />
              </Grid>
            )}
            {/** Doctor Entries Section */}
            <Grid item xs={12}>
              <DataTable
                header={[
                  { display: "Doctor", key: "doctorName" },
                  { display: "Number Patient", key: "numPatient" },
                  { display: "Night Patient", key: "nightPatient" },
                  { display: "action", key: "action" },
                ]}
                data={doctorEntries.map((entry, index) => ({
                  doctorName: entry.doctorName,
                  numPatient: entry.numPatient,
                  nightPatient: entry.nightPatient,
                  action: (
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        handleDeleteDoctor(index);
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
        style={{
          backgroundColor: "white",
          fontSize: "2rem",
          padding: "3rem",
        }}
        id="report-form"
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "3rem",
            textAlign: "center",
          }}
        >
          {formState.date} Clinic {clinic}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "5rem",
            justifyContent: "space-between",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto", // Define three columns: left, middle, right
              alignItems: "center",
              rowGap: "0",
              columnGap: "1rem",
            }}
          >
            <span style={{ textAlign: "left" }}>ជំងឺប.ស.ស</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>
              {formState.insuredPatient} នាក់
            </span>{" "}
            <span style={{ textAlign: "left" }}>កម្មករ</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>
              {formState.worker} នាក់
            </span>{" "}
            <span style={{ textAlign: "left" }}>មន្ត្រី</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>
              {formState.government} នាក់
            </span>{" "}
            <span style={{ textAlign: "left" }}>ស្វ័យនិយោជន៍</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>
              {formState.dependent} នាក់
            </span>{" "}
            <span style={{ textAlign: "left" }}>គ្រោះថ្នាក់ការងារ</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>
              {formState.workplaceIncident} នាក់
            </span>{" "}
            <span style={{ textAlign: "left" }}>សំរាកពេទ្យ</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>
              {formState.insuredStayOver} នាក់
            </span>{" "}
            <span style={{ textAlign: "left" }}>ជំងឺទូទៅ</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>
              {formState.general} នាក់
            </span>{" "}
            <span style={{ textAlign: "left" }}>ដេកពេទ្យ</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>
              {formState.generalStayOver} នាក់
            </span>{" "}
            <span style={{ textAlign: "left" }}>ចំណូល</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>{formState.income}</span>{" "}
            <span style={{ textAlign: "left" }}>ABA</span>
            <span>:</span>
            <span style={{ textAlign: "left" }}>{formState.ABA}</span>{" "}
          </div>
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto", // Define three columns: left, middle, right
                alignItems: "center",
                columnGap: "1rem",
                rowGap: "0",
              }}
            >
              <span style={{ textAlign: "left" }}>Echo</span>
              <span>:</span>
              <span style={{ textAlign: "left" }}>
                {formState.Echo} នាក់
              </span>{" "}
              <span></span>
              <span style={{ textAlign: "left" }}>Eva</span>
              <span>:</span>
              <span style={{ textAlign: "left" }}>
                {formState.Eva} ប្រអប់
              </span>{" "}
              <span></span>
              <span style={{ textAlign: "left" }}>Meuri</span>
              <span>:</span>
              <span style={{ textAlign: "left" }}>
                {formState.Meuri} ប្រអប់
              </span>{" "}
              <span></span>
              {doctorEntries.map((entry, index) => (
                <>
                  <span style={{ textAlign: "left" }}>
                    Dr.{entry.doctorName}
                  </span>
                  <span>:</span>
                  <span style={{ textAlign: "left" }}>
                    {entry.numPatient} នាក់
                  </span>{" "}
                  <span>(យប់: {entry.nightPatient} នាក់)</span>
                </>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginTop: "2rem",
          }}
        >
          <div>
            <span>ស្កេនមេដៃអត់ជាប់ (រូបថត): {formState.picture} នាក់</span>
          </div>
          {scan ? (
            <div>
              <label>
                <input
                  type="checkbox"
                  name="exampleCheckbox"
                  value="checkedValue"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                  checked={scan}
                  onChange={() => {}}
                />
                ស្កេនរួច
              </label>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "row", gap: "3rem" }}>
              <label>
                <input
                  type="checkbox"
                  name="exampleCheckbox"
                  value="checkedValue"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                  checked={!scan}
                  onChange={() => {}}
                />
                សល់
              </label>

              {!scan && <div>{formState.scan} នាក់</div>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
