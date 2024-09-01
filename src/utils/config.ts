export const prescriptionPdfConfigEn = {
  margin: 12,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  titleFont: "Helvetica",
  titleFontSize: 14,
  normalFontSize: 12,
  subTitleFontSize: 14,
  smallFontSize: 10,
  content: {
    titleTextLine1: "First Line",
    titleTextLine2: "Second Line",
    nameLabel: "Name:",
    sexLabel: "Sex:  ",
    sexValue: {
      male: "Male",
      female: "Female",
    },
    ageLabel: "Age:  ",
    diagnosisLabel: "Diagnosis:  ",
    prescriptionLabel: {
      title: "Prescription",
      medicine: "Medicine",
      amount: "Amount",
      usage: "Usage",
    },
    doctorTitle: "Dr.",
    bottomText: "This is a sample text for the bottom of the page.",
    address: "test",
  },
};

export const invoicePdfConfigEn = {
  margin: 13,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  fancyKhFont: "Fancy-Khmer",
  titleFontSize: 16,
  normalFontSize: 12,
  content: {
    titleTextLine1: "មន្ទីរពហុព្យាបាល សុខសាន្ត",
    titleTextLine2: "SOK SAN POLYCLINIC",
    nameLabel: "Name: ",
    invoiceLabel: "Invoice:",
    genderLabel: "Gender: ",
    sexValue: {
      male: "Male",
      female: "Female",
    },
    ageLabel: "Age: ",
    ageValue: (age: number) => age,
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
    header: "",
    logoText: "មន្ទីរពហុព្យាបាល សុខសាន្ត\nSOK SAN POLYCLINIC",
    SignatureLabelEn: "Accountant Signature",
    SignatureLabelKh: "ហត្ថលេខា បេឡា",
    footer: { soksan: undefined },
  },
};

export const prescriptionPdfConfigKh = {
  margin: 45,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  titleFont: "Fancy-Khmer",
  titleFontSize: 16,
  normalFontSize: 12,
  subTitleFontSize: 14,
  smallFontSize: 10,
  content: {
    titleTextLine1: "មន្ទីរពហុព្យាបាល សុខសាន្ត",
    titleTextLine2: "SOK SAN POLYCLINIC",
    nameLabel: "ឈ្មោះ:  ",
    sexLabel: "ភេទ:  ",
    sexValue: {
      male: "ប្រុស",
      female: "ស្រី",
    },
    ageLabel: "អាយុ:  ",
    diagnosisLabel: "រោគវិនិច្ឆ័យ:   ",
    prescriptionLabel: {
      title: "វេជ្ជបញ្ជា",
      medicine: "ឈ្មោះថ្នាំ",
      amount: "ចំនួន",
      usage: "ការប្រើប្រាស់",
    },
    doctorTitle: "វេជ្ជ.",
    bottomText: "សូមយកវេជ្ជបញ្ជានេះមកវិញ ពេលមកពិនិត្យលេីកក្រោយ",
    address:
      "ផ្ទះលេខ ៧៦៤, ផ្លូវជាតិលេខ ៥ គីឡូម៉ែត្រលេខ ៦, ខណ្ឌ ឬស្សីកែវ រាជធានីភ្នំពេញ Tel: 010/017 89 22 89",
  },
};

export const invoicePdfConfigKh = {
  margin: 24,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  fancyKhFont: "Fancy-Khmer",
  titleFontSize: 14,
  normalFontSize: 10,
  content: {
    titleTextLine1: "វិក្ក័យបត្រ / Invoice",
    titleTextLine2: "ឈ្មោះ / Name:",
    nameLabel: "ឈ្មោះ / Name: ",
    invoiceLabel: "លេខរៀងវិក្ក័យបត្រ:",
    genderLabel: "ភេទ / Gender: ",
    sexValue: {
      male: "Male",
      female: "Female",
    },
    ageLabel: "អាយុ / Age: ",
    ageValue: (age: number) => age,
    dateLabel: "ថ្ងៃចេញវិក្ក័យបត្រ: ",
    prescriptionLabel: {
      header: [
        { header: "លរ\n ", dataKey: "No" },
        { header: "បរិយាយមុខទំនិញ\nDescription", dataKey: "Description" },
        { header: "បរិមាណ\nQty", dataKey: "Qty" },
        { header: "តម្លៃរាយ\nUnit Price", dataKey: "unitPrice" },
        { header: "តម្លៃទំនិញ\nAmount", dataKey: "Amount" },
      ],
      totalLabel: "តម្លៃសរុប",
    },
    SignatureLabelEn: "Accountant Signature",
    SignatureLabelKh: "ហត្ថលេខា បេឡា",
    header: "ព្រះរាជាណាចក្រកម្ពុជា\nជាតិ សាសនា ព្រះមហាក្សត្រ",
    logoText: "មន្ទីរពហុព្យាបាល សុខសាន្ត\nSOKSAN POLYCLINIC",
    footer: {
      soksan:
        "ផ្ទះលេខ ៧៦៤, ផ្លូវជាតិលេខ ៥ គីឡូម៉ែត្រលេខ ៦, ខណ្ឌ ឬស្សីកែវ រាជធានីភ្នំពេញ (ទល់មុខរោងចក្រ កូកាកូឡា)\nលេខទូរស័ព្ទ 010 89 22 89, 017 89 22 89, 012 99 37 22",
      sokeo:
        "ផ្ទះលេខ18, ផ្លូវ114k, ភូមិត្រពាំងពោធ៍ សង្កាត់ចោមចៅ ខណ្ឌពោធ៍សែនជ័យ រាជធានីភ្នំពេញ\nលេខទូរស័ព្ទ 010/061 93 81 93",
    },
  },
};

export const sokhengInvoicePdfConfigKh = {
  margin: 24,
  spacing: 8,
  khFont: "Khmer",
  enFont: "Helvetica",
  fancyKhFont: "Fancy-Khmer",
  titleFontSize: 14,
  normalFontSize: 10,
  content: {
    titleTextLine1: "វិក្ក័យបត្រ / Invoice",
    titleTextLine2: "ឈ្មោះ / Name:",
    nameLabel: "ឈ្មោះ / Name: ",
    invoiceLabel: "លេខរៀងវិក្ក័យបត្រ:",
    genderLabel: "ភេទ / Gender: ",
    sexValue: {
      male: "ប្រុស",
      female: "ស្រី",
    },
    ageLabel: "អាយុ / Age: ",
    ageValue: (age: number) => age + " ឆ្នាំ",
    dateLabel: "ថ្ងៃចេញវិក្ក័យបត្រ: ",
    prescriptionLabel: {
      header: [
        { header: "លរ\n ", dataKey: "No" },
        { header: "បរិយាយមុខទំនិញ\nDescription", dataKey: "Description" },
        { header: "បរិមាណ\nQty", dataKey: "Qty" },
        { header: "តម្លៃរាយ\nUnit Price", dataKey: "unitPrice" },
        { header: "តម្លៃទំនិញ\nAmount", dataKey: "Amount" },
      ],
      totalLabel: "តម្លៃសរុប",
    },
    SignatureLabelEn: "Accountant Signature",
    SignatureLabelKh: "ហត្ថលេខា បេឡា",
    header: "ព្រះរាជាណាចក្រកម្ពុជា\nជាតិ សាសនា ព្រះមហាក្សត្រ",
    logoText: "មន្ទីរពហុព្យាបាល សុខសាន្ត\nSOKSAN POLYCLINIC",
    footer: {
      soksan:
        "ផ្ទះលេខ ៧៦៤, ផ្លូវជាតិលេខ ៥ គីឡូម៉ែត្រលេខ ៦, ខណ្ឌ ឬស្សីកែវ រាជធានីភ្នំពេញ (ទល់មុខរោងចក្រ កូកាកូឡា)\nលេខទូរស័ព្ទ 010 89 22 89, 017 89 22 89, 012 99 37 22",
      sokeo:
        "ផ្ទះលេខ ២០-២១-២២, ផ្លូវ ១២៣K, ភូមិត្រពាំងពោធ៍ សង្កាត់ចោមចៅ ខណ្ឌពោធ៍សែនជ័យ រាជធានីភ្នំពេញ\nលេខទូរស័ព្ទ 010/061 93 81 93",
    },
  },
};

export const Month = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const signatureMetaData = {
  bin_phal: {
    aspectRatio: 3.05,
  },
  huot_sothaly: {
    aspectRatio: 2.73,
  },
};

export const clinicConfig = {
  soksan: {
    kh: {
      prescriptionConfig: prescriptionPdfConfigKh,
      invoiceConfig: invoicePdfConfigKh,
    },
    en: {
      prescriptionConfig: prescriptionPdfConfigEn,
      invoiceConfig: invoicePdfConfigEn,
    },
  },
  sokeo: {
    kh: {
      prescriptionConfig: prescriptionPdfConfigKh,
      invoiceConfig: invoicePdfConfigKh,
    },
    en: {
      prescriptionConfig: prescriptionPdfConfigEn,
      invoiceConfig: invoicePdfConfigEn,
    },
  },
  sokheng: {
    kh: {
      prescriptionConfig: prescriptionPdfConfigKh,
      invoiceConfig: sokhengInvoicePdfConfigKh,
    },
    en: {
      prescriptionConfig: prescriptionPdfConfigEn,
      invoiceConfig: invoicePdfConfigEn,
    },
  },
};
