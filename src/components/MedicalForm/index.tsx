import {
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
  dob: string;
  diagnosis: string;
  medicine: string;
  amount: number;
  usage: string;
}

interface Prescription {
  medicine: string;
  amount: number;
  usage: string;
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
    dob: "",
    diagnosis: "",
    medicine: "",
    amount: 0,
    usage: "",
  });
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    doctor: "",
    accountant: "",
  });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const printJS = useRef<any>();

  useEffect(() => {
    printJS.current = require("print-js");
  }, []);

  const onFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value, typeof e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onClickAddMedicine = () => {
    setPrescriptions([
      ...prescriptions,
      {
        medicine: formData.medicine,
        amount: formData.amount,
        usage: formData.usage,
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
    console.log(index, prescriptions[index]);
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const onClickFormCancel = () => {
    setFormData({
      name: "",
      sex: "",
      dob: "",
      diagnosis: "",
      medicine: "",
      amount: 0,
      usage: "",
    });
    setPrescriptions([]);
  };

  const onClickSubmit = async () => {
    try {
      const today = new Date();
      const todayDate = today.toISOString().split("T")[0];
      console.log({
        name: formData.name,
        sex: formData.sex,
        age: getAge(formData.dob),
        dob: formData.dob,
        diagnosis: diagnosisList.find(
          (item) => item.name === formData.diagnosis
        ),
        prescription: prescriptions.map((item) => {
          const med = medicineList.find((m) => m.medicine === item.medicine);
          return {
            ...item,
            price: med?.price || 0,
            id: med?.id,
          };
        }),
        date: todayDate,
        doctor: doctorList.find((item) => item.name === employeeInfo.doctor),
        accountant: accountantList.find(
          (item) => item.name === employeeInfo.accountant
        ),
      });
      const response = await axios.post(
        "/api/pdf",
        {
          name: formData.name,
          sex: formData.sex,
          age: getAge(formData.dob),
          dob: formData.dob,
          diagnosis: diagnosisList.find(
            (item) => item.name === formData.diagnosis
          ),
          prescription: prescriptions.map((item) => {
            const med = medicineList.find((m) => m.medicine === item.medicine);
            return {
              ...item,
              price: med?.price || 0,
              id: med?.id,
            };
          }),
          date: todayDate,
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <StyledPaper elevation={2}>
        <FormControl fullWidth>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <h2>Form</h2>
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                disablePortal
                options={doctorList.map((item) => item.name)}
                // freeSolo
                value={employeeInfo.doctor}
                onChange={(e, newValue) => {
                  console.log(newValue);
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
            <Grid item xs={2}>
              <Autocomplete
                disablePortal
                options={accountantList.map((item) => item.name)}
                // freeSolo
                value={employeeInfo.accountant}
                onChange={(e, newValue) => {
                  console.log(newValue);
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
            <Grid item xs={6}>
              <TextField
                id="name-field"
                label={formLabel.name}
                placeholder={formLabel.namePlaceholder}
                fullWidth
                onChange={onFormDataChange}
                name="name"
                value={formData.name}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label={formLabel.sex}
                fullWidth
                onChange={onFormDataChange}
                select
                name="sex"
                value={formData.sex}
              >
                <MenuItem value={"male"}>{formLabel.sexOptions.male}</MenuItem>
                <MenuItem value={"female"}>
                  {formLabel.sexOptions.female}
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="date"
                variant="outlined"
                color="secondary"
                label={formLabel.dob}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
                onChange={onFormDataChange}
                value={formData.dob}
                name="dob"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                options={diagnosisList.map((item) => item.name)}
                // freeSolo
                value={formData.diagnosis}
                onChange={(e, newValue) => {
                  console.log(newValue);
                  setFormData({
                    ...formData,
                    diagnosis: newValue || "",
                  });
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
                  console.log(newValue);
                  setFormData({
                    ...formData,
                    medicine: newValue || "",
                  });
                }}
                autoSelect
                renderInput={(params) => (
                  <TextField {...params} label={formLabel.medicine} />
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
                  console.log(newValue);
                  setFormData({
                    ...formData,
                    usage: newValue || "",
                  });
                }}
                autoSelect
                renderInput={(params) => (
                  <TextField {...params} label={formLabel.usage} />
                )}
              />
            </Grid>
            <Grid item xs={1} style={{ display: "flex", alignItems: "center" }}>
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
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={onClickFormCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </StyledPaper>
    </Wrapper>
  );
};
export default MedicalForm;
