export interface clinic {
  id: string;
  name: string;
  title_en: string;
  title_kh: string;
  address: string;
  phone_number: string;
}
export interface Prescription {
  medicine: string;
  amount: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  usage: string;
  addInto: string;
}
