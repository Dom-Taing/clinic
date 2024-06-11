export const formLabelEn = {
  name: "Name",
  sex: "Sex",
  dob: "Date of Birth",
  age: "Age",
  diagnosis: "Diagnosis",
  medicine: "Medicine",
  amount: "Amount",
  unit: "Unit",
  usage: "Usage",
  addInto: "Add Into",
  addIntoOptions: {
    prescription: "Prescription",
    invoice: "Invoice",
    both: "Both",
  },
  namePlaceholder: "Enter Patient Name",
  sexOptions: {
    male: "Male",
    female: "Female",
  },
  addButton: "add",
  medicineTitle: "Medicine",
  doctor: "Doctor",
  accountant: "Accountant",
  unitPrice: "Unit Price",
  totalPrice: "Total Price",
  submit: "Submit",
  clear: "Clear",
  date: "Date",
};
export const formLabelKh = {
  name: "ឈ្មោះ",
  sex: "ភេទ",
  dob: "ថ្ងៃខែ​ឆ្នាំ​កំណើត",
  age: "អាយុ",
  diagnosis: "រោគវិនិច្ឆ័យ",
  medicine: "ឈ្មោះថ្នាំ",
  amount: "ចំនួន",
  unit: "ឯកតា",
  usage: "ការប្រើប្រាស់",
  addInto: "បញ្ចូលទៅក្នុង",
  addIntoOptions: {
    prescription: "វេជ្ជបញ្ជា",
    invoice: "វិក្កយបត្រ",
    both: "ទាំងពីរ",
  },
  namePlaceholder: "បញ្ចូលឈ្មោះអ្នកជំងឺ",
  sexOptions: {
    male: "ប្រុស",
    female: "ស្រី",
  },
  addButton: "បញ្ចូល",
  medicineTitle: "ថ្នាំ",
  doctor: "វេជ្ជបណ្ឌិត",
  accountant: "គណនេយ្យករ",
  unitPrice: "តម្លៃរាយ",
  totalPrice: "តម្លៃសរុប",
  submit: "ដាក់បញ្ចូល",
  clear: "សំអាត",
  date: "កាលបរិច្ឆេទ",
};

const unitOptions = ["គ្រាប់", "កញ្ចប់", "អំពូល", "ដប"];
const amountNumberOptions = ["5", "10"];
export const amountOptions = unitOptions
  .map((unit) => amountNumberOptions.map((amount) => `${amount} ${unit}`))
  .flat();

export enum Org {
  Soksan = "soksan",
  Sokheng = "sokheng",
  Sokeo = "sokeo",
}
