export const prescriptionPdfConfigEn = {
  margin: 12,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  titleFont: "Helvetica",
  titleFontSize: 14,
  normalFontSize: 12,
  subTitleFontSize: 14,
  content: {
    titleTextLine1: "First Line",
    titleTextLine2: "Second Line",
    nameLabel: "Name:",
    sexLabel: "Sex:  ",
    ageLabel: "Age:  ",
    diagnosisLabel: "Diagnosis:  ",
    prescriptionLabel: {
      title: "Prescription",
      medicine: "Medicine",
      amount: "Amount",
      usage: "Usage",
    },
    bottomText: "This is a sample text for the bottom of the page.",
  },
};

export const invoicePdfConfigEn = {
  margin: 13,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  titleFontSize: 16,
  normalFontSize: 12,
  content: {
    titleTextLine1: "មន្ទីរពហុព្យាបាល សុខសាន្ត",
    titleTextLine2: "SOK SAN POLYCLINIC",
    nameLabel: "Name: ",
    invoiceLabel: "Invoice:",
    genderLabel: "Gender: ",
    ageLabel: "Age: ",
    dateLabel: "Date: ",
    prescriptionLabel: {
      header: [
        { header: "No", dataKey: "No" },
        { header: "Description", dataKey: "Description" },
        { header: "Qty", dataKey: "Qty" },
        { header: "Unit Price", dataKey: "Unit Price" },
        { header: "Amount", dataKey: "Amount" },
      ],
      totalLabel: "Total",
    },
    SignatureLabel: "Signature",
    footer: "",
  },
};

export const prescriptionPdfConfigKh = {
  margin: 45,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  titleFont: "Fancy-Khmer",
  titleFontSize: 14,
  normalFontSize: 10,
  subTitleFontSize: 12,
  content: {
    titleTextLine1: "មន្ទីរពហុព្យាបាល សុខសាន្ត",
    titleTextLine2: "SOK SAN POLYCLINIC",
    nameLabel: "ឈ្មោះ:  ",
    sexLabel: "ភេទ:  ",
    ageLabel: "អាយុ:  ",
    diagnosisLabel: "រោគវិនិច្ឆ័យ:  ",
    prescriptionLabel: {
      title: "វេជ្ជបញ្ជា",
      medicine: "ឈ្មោះថ្នាំ",
      amount: "ចំនួន",
      usage: "ការប្រើប្រាស់",
    },
    bottomText: "សូមយកវេជ្ជបញ្ជានេះមកវិញ ពេលមកពិនិត្យលេីកក្រោយ",
  },
};

export const invoicePdfConfigKh = {
  margin: 24,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  titleFontSize: 14,
  normalFontSize: 8,
  content: {
    titleTextLine1: "វិក្ក័យបត្រ / Invoice",
    titleTextLine2: "ឈ្មោះ / Name:",
    nameLabel: "ឈ្មោះ / Name: ",
    invoiceLabel: "លេខរៀងវិក្ក័យបត្រ:",
    genderLabel: "ភេទ / Gender: ",
    ageLabel: "អាយុ / Age: ",
    dateLabel: "ថ្ងៃចេញវិក្ក័យបត្រ: ",
    prescriptionLabel: {
      header: [
        { header: "លរ\n ", dataKey: "No" },
        { header: "បរិយាយមុខទំនិញ\nDescription", dataKey: "Description" },
        { header: "បរិមាណ\nQty", dataKey: "Qty" },
        { header: "តម្លៃរាយ\nUnit Price", dataKey: "Unit Price" },
        { header: "តម្លៃទំនិញ\nAmount", dataKey: "Amount" },
      ],
      totalLabel: "តម្លៃសរុប",
    },
    SignatureLabel: "ហត្ថលេខា\nSignature",
    footer:
      "ផ្ទះលេខ ៧៦៨, ផ្លូវជាតិលេខ ៥ គីឡូម៉ែត្រលេខ ៦, ខណ្ឌ ឬស្សីកែវ រាជធានីភ្នំពេញ (ទល់មុខរោងចក្រ កូកាកូឡា)\nលេខទូរស័ព្ទ 010 89 22 89, 017 89 22 89, 012 99 37 22",
  },
};
