import { TextField } from "@mui/material";

export const translation = {
  general: "ពិគ្រោះជំងឺទូទៅ",
  worker: "កម្មករ",
  government: "មន្ត្រីរាជការ",
  selfEmployed: "ស្វ័យនិយោជន៍",
  workInjury: "គ្រោះថ្នាក់ការងារ",
  stayIn: "សំរាកពេទ្យ",
  total: "អ្នកជំងឺទូទៅសរុប",
  moneyTotal: "Total(៛)",
  picture: "រូបថត",
};

export const form = [
  {
    headerLabel: "Date",
    inputs: [
      {
        type: "date",
        label: "Date",
        InputLabelProps: { shrink: true },
        component: TextField,
      },
    ],
  },
  {
    headerLabel: "ជំងឺប.ស.ស",
    inputs: [
      {
        type: "number",
        label: "ជំងឺប.ស.ស",
      },
      {
        type: "number",
        label: "កម្មករ",
      },
      {
        type: "number",
        label: "មន្ត្រី",
      },
      {
        type: "number",
        label: "ស្វ័យនិយោជន៍",
      },
      {
        type: "number",
        label: "គ្រោះថ្នាក់ការងារ",
      },
      {
        type: "number",
        label: "សំរាកពេទ្យ",
      },
    ],
  },
  {
    headerLabel: "ជំងឺទូទៅ",
    inputs: [
      { type: "number", label: "ជំងឺទូទៅ" },
      {
        type: "number",
        label: "ដេកពេទ្យ",
      },
    ],
  },
  {
    headerLabel: "ចំណូល",
    inputs: [
      { type: "number", label: "ចំណូល" },
      { type: "number", label: "ABA" },
    ],
  },
  {
    headerLabel: "គ្រូពេទ្យ",
    inputs: [
      { type: "number", label: "Echo" },
      { type: "number", label: "Eva" },
      { type: "number", label: "Meuri" },
    ],
  },
  {
    headerLabel: "ស្កេនមេដៃអត់ជាប់ (រូបថត)",
    inputs: [{ label: "ស្កេនមេដៃអត់ជាប់ (រូបថត)", type: "number" }],
  },
  {
    headerLabel: "ស្កេន",
    inputs: [{ label: "ស្កេន", type: "number" }],
  },
];

export const medicineList = ["Echo", "Eva", "Meuri"];
