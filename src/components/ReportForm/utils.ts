import { form } from "./config";
import { DoctorEntry, FormState } from "./reportForm";

const parseNum = (value: string | number) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const validationForm = (
  formState: FormState,
  doctorEntries: DoctorEntry[]
) => {
  if (
    doctorEntries.reduce(
      (acc, entry) => acc + parseInt(entry.numPatient || "0", 10),
      0
    ) !== parseInt(formState.insuredPatient || "0", 10)
  ) {
    alert("ចំនួនអ្នកជំងឺមិនត្រូវគ្នា។");
    return false;
  }
  // const totalInsuredPatient =
  //   parseNum(formState.worker) +
  //   parseNum(formState.government) +
  //   parseNum(formState.dependent) +
  //   parseNum(formState.workplaceIncident);
  // if (parseNum(formState.insuredPatient) !== totalInsuredPatient) {
  //   alert("ចំនួនអ្នកជំងឺមិនត្រឹមត្រូវ។");
  //   return false;
  // }
  return true;
};
