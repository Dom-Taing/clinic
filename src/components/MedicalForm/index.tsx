import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { formLabelEn, formLabelKh } from "./config";
import axios from "axios";
import DataTable from "../DataTable";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";
import { getAge } from "@/utils/date";
import LoadingScreen from "../UI/LoadingScreen/LoadingScreen";

interface FormProps {
  medicineList: { id: string; medicine: string; price: number }[];
  diagnosisList: { id: string; name: string }[];
  doctorList: { id: string; name: string }[];
  accountantList: { id: string; name: string }[];
  usageList: { id: string; usage: string }[];
}

interface PersonalInfo {
  name: string;
  sex: string;
  age: number;
  diagnosis: string;
  medicine: string;
  amount: number;
  usage: string;
  date: string;
}

interface Prescription {
  medicine: string;
  amount: number;
  unitPrice: number;
  totalPrice: number;
  usage: string;
}

interface ErrorType {
  general: string;
  name: string;
  age: string;
  sex: string;
  diagnosis: string;
  medicine: string;
  amount: string;
  usage: string;
  date: string;
}

interface EmployeeInfo {
  doctor: string;
  accountant: string;
}

const StyledPaper = styled(Paper)`
  padding: 1rem;
`;

const Wrapper = styled.div`
  max-width: 1000px;
`;

const formLabel = formLabelKh;

const MedicalForm: React.FC<FormProps> = ({
  medicineList = [],
  diagnosisList = [],
  doctorList = [],
  accountantList = [],
  usageList = [],
}) => {
  const [formData, setFormData] = useState<PersonalInfo>({
    name: "",
    sex: "",
    age: 0,
    diagnosis: "",
    medicine: "",
    amount: 0,
    usage: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    doctor: "",
    accountant: "",
  });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [error, setError] = useState<ErrorType>({
    general: "",
    name: "",
    sex: "",
    age: "",
    diagnosis: "",
    medicine: "",
    amount: "",
    usage: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const printJS = useRef<any>();

  useEffect(() => {
    printJS.current = require("print-js");
  }, []);

  const onFormDataChange = (
    e: any,
    name: string | null = null,
    value: string | null = null
  ) => {
    const objName = name || e.target.name;
    const objValue = value || e.target.value;
    console.log(objName, objValue);
    setFormData({
      ...formData,
      [objName]: objValue,
    });
    setError({
      ...error,
      [objName]: "",
    });
  };

  const onClickAddMedicine = () => {
    if (!formData.medicine) {
      setError((prev: any) => ({ ...prev, medicine: "Medicine is required" }));
      return;
    }
    const unitPrice =
      medicineList.find((m) => m.medicine === formData.medicine)?.price || 0;
    const totalPrice = unitPrice * formData.amount;
    setPrescriptions([
      ...prescriptions,
      {
        medicine: formData.medicine,
        amount: formData.amount,
        usage: formData.usage,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
      },
    ]);
    setFormData({
      ...formData,
      medicine: "",
      amount: 0,
      usage: "",
    });
  };

  const onClickDeleteMedicine = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const onClickFormCancel = () => {
    const selectedDate = formData.date;
    setFormData({
      name: "",
      sex: "",
      age: 0,
      diagnosis: "",
      medicine: "",
      amount: 0,
      usage: "",
      date: selectedDate,
    });
    setPrescriptions([]);
  };

  const onClickSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/pdf",
        {
          name: formData.name,
          sex: formData.sex,
          age: formData.age,
          diagnosis: formData.diagnosis,
          prescription: prescriptions,
          date: formData.date,
          doctor: doctorList.find((item) => item.name === employeeInfo.doctor),
          accountant: accountantList.find(
            (item) => item.name === employeeInfo.accountant
          ),
        },
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);

      printJS.current({
        printable: pdfUrl,
        type: "pdf",
        onPrintDialogClose: () => {
          URL.revokeObjectURL(pdfUrl);
        },
      });
      setError({ ...error, general: "" });
    } catch (error) {
      console.log(error);
      setError((prev: any) => ({
        ...prev,
        general: "Something went wrong! Please Try Again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Wrapper>
        <StyledPaper elevation={2}>
          <FormControl fullWidth>
            <Grid container spacing={3}>
              {error.general && (
                <Grid item xs={12}>
                  <Alert severity="error">{error.general}</Alert>
                </Grid>
              )}
              <Grid item xs={4}>
                <TextField
                  id="date-field"
                  label={formLabel.date}
                  fullWidth
                  onChange={(e) => onFormDataChange(e)}
                  name="date"
                  value={formData.date}
                  error={!!error.date}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  disablePortal
                  options={doctorList.map((item) => item.name)}
                  // freeSolo
                  value={employeeInfo.doctor}
                  onChange={(e, newValue) => {
                    setEmployeeInfo({
                      ...employeeInfo,
                      doctor: newValue || "",
                    });
                  }}
                  autoSelect
                  renderInput={(params) => (
                    <TextField {...params} label={formLabel.doctor} />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  disablePortal
                  options={accountantList.map((item) => item.name)}
                  // freeSolo
                  value={employeeInfo.accountant}
                  onChange={(e, newValue) => {
                    setEmployeeInfo({
                      ...employeeInfo,
                      accountant: newValue || "",
                    });
                  }}
                  autoSelect
                  renderInput={(params) => (
                    <TextField {...params} label={formLabel.accountant} />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h2>Form</h2>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="name-field"
                  label={formLabel.name}
                  placeholder={formLabel.namePlaceholder}
                  fullWidth
                  onChange={(e) => onFormDataChange(e)}
                  name="name"
                  value={formData.name}
                  error={!!error.name}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label={formLabel.sex}
                  fullWidth
                  onChange={(e) => onFormDataChange(e)}
                  select
                  name="sex"
                  value={formData.sex}
                >
                  <MenuItem value={"male"}>
                    {formLabel.sexOptions.male}
                  </MenuItem>
                  <MenuItem value={"female"}>
                    {formLabel.sexOptions.female}
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  label={formLabel.age}
                  fullWidth
                  name="age"
                  value={formData.age}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    e.target.value = value.replace(/^0+/, "") || "0";
                    onFormDataChange(e);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  options={diagnosisList.map((item) => item.name)}
                  freeSolo
                  value={formData.diagnosis}
                  onChange={(e, newValue) => {
                    onFormDataChange(e, "diagnosis", newValue || "");
                  }}
                  autoSelect
                  renderInput={(params) => (
                    <TextField {...params} label={formLabel.diagnosis} />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  disablePortal
                  options={medicineList.map((item) => item.medicine)}
                  // freeSolo
                  value={formData.medicine}
                  onChange={(e, newValue) => {
                    onFormDataChange(e, "medicine", newValue || "");
                  }}
                  onInputChange={() => {
                    setError({ ...error, medicine: "" });
                  }}
                  autoSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={formLabel.medicine}
                      error={!!error.medicine}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  type="number"
                  label={formLabel.amount}
                  fullWidth
                  name="amount"
                  value={formData.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    e.target.value = value.replace(/^0+/, "") || "0";
                    onFormDataChange(e);
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  disablePortal
                  options={usageList.map((item) => item.usage)}
                  // freeSolo
                  value={formData.usage}
                  onChange={(e, newValue) => {
                    onFormDataChange(e, "usage", newValue || "");
                  }}
                  autoSelect
                  renderInput={(params) => (
                    <TextField {...params} label={formLabel.usage} />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={onClickAddMedicine}
                >
                  {formLabel.addButton}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <h3>{formLabel.medicineTitle}</h3>
              </Grid>
              <Grid item xs={12}>
                <DataTable
                  header={[
                    { display: formLabel.medicine, key: "medicine" },
                    { display: formLabel.amount, key: "amount" },
                    { display: formLabel.usage, key: "usage" },
                    { display: formLabel.unitPrice, key: "unitPrice" },
                    { display: formLabel.totalPrice, key: "totalPrice" },
                    { display: "action", key: "action" },
                  ]}
                  data={prescriptions.map((item, index) => ({
                    ...item,
                    action: (
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => onClickDeleteMedicine(index)}
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
                  onClick={onClickSubmit}
                >
                  {formLabel.submit}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onClickFormCancel}
                >
                  {formLabel.clear}
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </StyledPaper>
      </Wrapper>
      <LoadingScreen isOn={loading} />
    </>
  );
};
export default MedicalForm;
