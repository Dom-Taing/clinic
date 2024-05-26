import {
  Month,
  invoicePdfConfigEn,
  invoicePdfConfigKh,
  prescriptionPdfConfigEn,
  prescriptionPdfConfigKh,
} from "./config";
import path from "path";
import fs from "fs";

interface Prescription {
  medicine: string;
  amount: number;
  unitPrice: number;
  totalPrice: number;
  usage: string;
  unit: string;
}
interface User {
  name: string;
  name_kh: string;
}
interface Prescriptiondata {
  prescription: Prescription[];
  name: string;
  sex: string;
  age: number;
  diagnosis: string;
  date: string;
  doctor: User;
}

interface InvoiceData {
  name: string;
  invoiceNo: string;
  sex: string;
  age: number;
  date: string;
  prescription: Prescription[];
  accountant: User;
}

// function addFonts(doc) {
//   doc.addFileToVFS("Khmer-Regular-normal.ttf", font);
//   doc.addFont("Khmer-Regular-normal.ttf", "Khmer-Regular", "normal");
// }

function formatDateKh(date: string) {
  const [year, month, day] = date.split("-");
  return `ថ្ងៃទី ${day} ខែ ${month} ឆ្នាំ ${year}`;
}

function formatDateEn(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}-${Month[parseInt(month)]}-${year}`;
}

function getFileName(name: string) {
  if (!name) return;
  const lowercaseName = name.toLowerCase();
  const fileName = lowercaseName.replace(/\s+/g, "_");
  return fileName;
}

export const createPrescriptionPdf = async (
  doc: any,
  language: "kh" | "en",
  { prescription, name, sex, age, diagnosis, date, doctor }: Prescriptiondata
) => {
  const { content, ...prescriptionPdfConfig } =
    language === "kh" ? prescriptionPdfConfigKh : prescriptionPdfConfigEn;
  const {
    margin,
    spacing,
    titleFontSize,
    normalFontSize,
    subTitleFontSize,
    smallFontSize,
  } = prescriptionPdfConfig;

  // Define the title text
  var titleTextLine1 = content.titleTextLine1;
  var titleTextLine2 = content.titleTextLine2;

  // Set font properties

  // Calculate position
  var pageWidth = doc.page.width;
  var xPos = 0;
  var yPos = margin; // Adjust as needed

  // logo
  xPos = margin;
  yPos = 8;
  doc.image(path.resolve("./public/logo.jpg"), xPos, yPos, {
    width: 60,
  });

  // Add Title
  doc.fontSize(titleFontSize);
  doc
    .font(prescriptionPdfConfig.titleFont)
    .text(titleTextLine1, doc.page.margins.left, doc.page.margins.top, {
      align: "center",
    });
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(titleTextLine2, { align: "center" });
  doc.moveDown(0.5);

  // Add normal text
  doc.fontSize(normalFontSize);
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(`${content.nameLabel}${name}`)
    .moveUp(1);
  xPos = pageWidth / 2;
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(
      `${content.sexLabel}${
        content.sexValue[sex as keyof typeof content.sexValue]
      }`,
      xPos
    )
    .moveUp(1);
  xPos = pageWidth * 0.75;
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(`${content.ageLabel}${age} ឆ្នាំ`, xPos, doc.y, {
      width: pageWidth / 4,
    });

  doc.moveDown(0.5);
  // second row
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(`${content.diagnosisLabel}`, margin, doc.y, {
      continued: !!diagnosis,
    })
    .font(prescriptionPdfConfig.enFont)
    .text(`${diagnosis}`, doc.x, doc.y + 2);
  doc.moveDown(0.5);

  // Draw line
  xPos = doc.page.margins.left;
  yPos = doc.y;
  doc
    .moveTo(xPos, yPos)
    .lineTo(pageWidth - xPos, yPos)
    .stroke();
  doc.moveDown(0.5);

  // prescription section
  const { prescriptionLabel } = content;

  // prescription title
  doc
    .fontSize(subTitleFontSize)
    .font(prescriptionPdfConfig.khFont)
    .text(prescriptionLabel.title, xPos, doc.y, {
      align: "center",
      underline: true,
      width: pageWidth - 22 - margin * 2,
    });
  doc.moveDown(0.5);

  // prescription medicine title
  const columnWidth = [
    ((pageWidth - margin * 2) * 4) / 10,
    ((pageWidth - margin * 2) * 2) / 10,
    ((pageWidth - margin * 2) * 4) / 10 + doc.page.margins.right,
  ];
  doc.fontSize(normalFontSize);
  xPos = doc.page.margins.left;
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(prescriptionLabel.medicine, xPos, doc.y, {
      underline: true,
      width: columnWidth[0],
    })
    .moveUp(1);
  xPos += columnWidth[0];
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(prescriptionLabel.amount, xPos, doc.y, {
      align: "left",
      underline: true,
      width: columnWidth[1],
    })
    .moveUp(1);
  xPos += columnWidth[1];
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(prescriptionLabel.usage, xPos, doc.y, {
      align: "center",
      underline: true,
      width: columnWidth[2] - doc.page.margins.right,
    });
  doc.moveDown(1.5);

  // medicine
  prescription.forEach((item, index) => {
    let startX = margin;
    let startY = doc.y;
    doc.fontSize(smallFontSize);
    doc
      .font(prescriptionPdfConfig.enFont)
      .text(`${index + 1}-`, 0, startY, { align: "right", width: margin });
    doc
      .font(prescriptionPdfConfig.enFont)
      .text(item.medicine, startX, startY, { width: columnWidth[0] });
    startX += columnWidth[0];
    doc
      .font(prescriptionPdfConfig.khFont)
      .text(`${item.amount.toString()} ${item.unit}`, startX, startY, {
        align: "left",
        width: columnWidth[1],
      });
    startX += columnWidth[1];
    doc
      .font(prescriptionPdfConfig.khFont)
      .text(item.usage || " ", startX, startY, {
        align: "left",
        width: columnWidth[2],
      });
    doc.moveDown(1);
  });
  // date
  yPos = doc.page.height - 140;
  xPos = 0;
  doc
    .fontSize(normalFontSize)
    .font(prescriptionPdfConfig.khFont)
    .text(formatDateKh(date), xPos, yPos, {
      align: "right",
      width: pageWidth - 22,
    });

  if (
    fs.existsSync(path.resolve(`./public/${getFileName(doctor?.name)}.png`))
  ) {
    const signatureWidth = 120;
    xPos = doc.page.width - 22 - signatureWidth;
    yPos = doc.y;
    doc.image(
      path.resolve(`./public/${getFileName(doctor?.name)}.png`),
      xPos,
      doc.y,
      {
        fit: [signatureWidth, 50],
        valign: "center",
        align: "center",
      }
    );
  }

  if (doctor?.name_kh) {
    yPos = doc.page.height - doc.page.margins.bottom - 48;
    xPos = margin;
    doc
      .fillColor("#5287BF")
      .font(prescriptionPdfConfig.titleFont)
      .fontSize(titleFontSize + 2)
      .text(`${content.doctorTitle}${doctor.name_kh}`, xPos, yPos, {
        align: "right",
        width: pageWidth - margin - 22,
      });
  }
  // footer
  yPos = doc.page.height - doc.page.margins.bottom - 32;
  xPos = 22;
  doc.fontSize(9);
  doc.fillColor("black");
  doc.font(prescriptionPdfConfig.khFont).text(content.bottomText, xPos, yPos);
  doc.moveDown(0.2);
  doc
    .moveTo(xPos, doc.y)
    .lineTo(pageWidth - xPos, doc.y)
    .stroke();
  doc.moveDown(0.2);
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(content.address, xPos, doc.y, { width: pageWidth });
  return;
};

export const createInvoicePdf = async (
  doc: any,
  language: "kh" | "en",
  { name, invoiceNo, sex, age, date, prescription, accountant }: InvoiceData
) => {
  const { content, ...invoicePdfConfig } =
    language === "kh" ? invoicePdfConfigKh : invoicePdfConfigEn;
  const { margin, spacing, titleFontSize, normalFontSize } = invoicePdfConfig;

  // Define the title text
  var titleTextLine1 = content.titleTextLine1;

  // set position
  var pageWidth = doc.page.width;
  var xPos = 0;
  var yPos = 0;

  // logo
  xPos = margin + 7;
  yPos = 8;
  doc.image(path.resolve("./public/logo.jpg"), xPos, yPos, {
    width: 60,
  });
  const logoText = content.logoText.split("\n");
  xPos = margin;
  yPos = 68;
  doc
    .fontSize(6)
    .font(invoicePdfConfig.fancyKhFont)
    .text(logoText[0], xPos, yPos, { width: 80, align: "center" })
    .moveDown(0.25)
    .fontSize(6)
    .font(invoicePdfConfig.enFont)
    .text(logoText[1], { width: 80, align: "center" });

  xPos = pageWidth - margin - 110;
  yPos = 8;
  doc
    .fontSize(8)
    .font(invoicePdfConfig.fancyKhFont)
    .text(content.header, xPos, yPos, { align: "center" });

  // title
  doc.text("", margin, margin);
  doc.moveDown(2);
  doc.fontSize(titleFontSize);
  doc.font(invoicePdfConfig.khFont).text(titleTextLine1, { align: "center" });
  doc.moveDown(1);

  // draw line
  xPos = margin;
  yPos = doc.y;
  doc
    .moveTo(xPos, yPos)
    .lineTo(pageWidth - xPos, yPos)
    .stroke();
  doc.moveDown(0.5);

  // normal text
  doc.fontSize(normalFontSize);
  xPos = margin * 1.5;
  doc
    .font(invoicePdfConfig.khFont)
    .text(`${content.nameLabel}${name}`, xPos)
    .moveUp(1);
  xPos = pageWidth * 0.625;
  doc
    .font(invoicePdfConfig.khFont)
    .text(`${content.invoiceLabel}${invoiceNo}`, xPos, doc.y);

  xPos = margin * 1.5;
  yPos = doc.y;
  doc
    .font(invoicePdfConfig.khFont)
    .text(
      `${content.genderLabel}${
        content.sexValue[sex as keyof typeof content.sexValue]
      }`,
      xPos,
      yPos
    )
    .moveUp(1);
  xPos = pageWidth * 0.375;
  doc
    .font(invoicePdfConfig.khFont)
    .text(`${content.ageLabel}${age}`, xPos)
    .moveUp(1);

  xPos = pageWidth * 0.625;
  doc
    .font(invoicePdfConfig.khFont)
    .text(`${content.dateLabel}${formatDateEn(date)}`, xPos, doc.y);
  doc.moveDown(1);

  // prescription
  const { prescriptionLabel } = content;
  const cellWidth = [33, 152, 50, 66, 70];
  const currX = margin;
  const cellYPos = [doc.y];
  const cellXPos = cellWidth.map((width, index) => {
    return index === 0
      ? currX
      : currX + cellWidth.slice(0, index).reduce((acc, val) => acc + val, 0);
  });

  doc
    .moveTo(cellXPos[0], doc.y)
    .lineTo(cellXPos[4] + cellWidth[4], doc.y)
    .stroke();
  prescriptionLabel.header.map((item, index) => {
    doc
      .text(item.header, cellXPos[index], doc.y, {
        width: cellWidth[index],
        align: "center",
      })
      .moveUp(2);
  });

  doc.moveDown(2);
  doc
    .moveTo(cellXPos[0], doc.y)
    .lineTo(cellXPos[4] + cellWidth[4], doc.y)
    .stroke();
  cellYPos.push(doc.y);

  let invoiceTable: Prescription[] = [
    {
      medicine: "Consultation",
      amount: 1,
      unitPrice: 20000,
      totalPrice: 20000,
      usage: "",
      unit: "",
    },
    ...prescription,
  ];
  invoiceTable.map((med, index) => {
    let yPos = doc.y;
    doc
      .font(invoicePdfConfig.khFont)
      .text(index + 1, cellXPos[0], yPos, {
        width: cellWidth[0],
        align: "center",
      })
      .font(invoicePdfConfig.enFont)
      .text(med.medicine, cellXPos[1], yPos + 2, {
        width: cellWidth[1],
        align: "left",
      })
      .font(invoicePdfConfig.khFont)
      .text(med.amount, cellXPos[2], yPos, {
        width: cellWidth[2],
        align: "center",
      })
      .text(med.unitPrice + " ៛", cellXPos[3], yPos, {
        width: cellWidth[3],
        align: "center",
      })
      .text(med.totalPrice + " ៛", cellXPos[4], yPos, {
        width: cellWidth[4],
        align: "center",
      });
    doc.moveDown(0.125);
    cellYPos.push(doc.y);
  });

  doc.font(invoicePdfConfig.khFont);
  doc
    .moveTo(cellXPos[0], doc.y)
    .lineTo(cellXPos[4] + cellWidth[4], doc.y)
    .stroke();

  const totalAmount = invoiceTable.reduce((acc: number, item: Prescription) => {
    return acc + item.amount * item.unitPrice;
  }, 0);
  doc
    .fontSize(normalFontSize)
    .text(prescriptionLabel.totalLabel, cellXPos[2], doc.y, {
      align: "center",
      width: cellWidth[2] + cellWidth[3],
    })
    .moveUp(1)
    .text(totalAmount + " ៛", cellXPos[4], doc.y, {
      align: "center",
      width: cellWidth[4],
    });

  cellYPos.push(doc.y);
  doc
    .moveTo(cellXPos[2], doc.y)
    .lineTo(cellXPos[4] + cellWidth[4], doc.y)
    .stroke();

  // vertical line
  doc
    .moveTo(cellXPos[0], cellYPos[cellYPos.length - 2])
    .lineTo(cellXPos[0], cellYPos[0])
    .stroke();
  doc
    .moveTo(cellXPos[1], cellYPos[cellYPos.length - 2])
    .lineTo(cellXPos[1], cellYPos[0])
    .stroke();
  doc
    .moveTo(cellXPos[2], cellYPos[cellYPos.length - 1])
    .lineTo(cellXPos[2], cellYPos[0])
    .stroke();
  doc
    .moveTo(cellXPos[3], cellYPos[cellYPos.length - 2])
    .lineTo(cellXPos[3], cellYPos[0])
    .stroke();
  doc
    .moveTo(cellXPos[4], cellYPos[cellYPos.length - 1])
    .lineTo(cellXPos[4], cellYPos[0])
    .stroke();
  doc
    .moveTo(cellXPos[4] + cellWidth[4], doc.y)
    .lineTo(cellXPos[4] + cellWidth[4], cellYPos[0])
    .stroke();

  // signature
  const signatureWidth = 150;
  const signatureHeight = 50;
  if (
    fs.existsSync(path.resolve(`./public/${getFileName(accountant?.name)}.png`))
  ) {
    xPos = doc.page.width - margin - signatureWidth;
    yPos = doc.page.height - 100 - signatureHeight;
    doc.image(
      path.resolve(`./public/${getFileName(accountant?.name)}.png`),
      xPos,
      yPos,
      {
        fit: [signatureWidth, 50],
        valign: "bottom",
        align: "center",
      }
    );
  }

  yPos = doc.page.height - 100;
  xPos = doc.page.width - margin - signatureWidth;
  doc
    .moveTo(xPos, yPos)
    .lineTo(xPos + signatureWidth, yPos)
    .stroke();
  doc.text(`${content.SignatureLabelKh} (${accountant?.name})`, xPos, yPos, {
    align: "center",
    width: signatureWidth,
  });
  doc.text(content.SignatureLabelEn, {
    align: "center",
    width: signatureWidth,
  });

  // footer
  yPos = doc.page.height - margin - 32;
  xPos = margin;
  doc.fontSize(8).text(content.footer, xPos, yPos, { align: "center" });
  return;
};

// export function printDocument(printable: any) {
//   return new Promise((resolve, reject) => {
//     printJS({
//       printable: printable,
//       type: "pdf",
//       onPrintDialogClose: () => resolve(true), // Resolve the promise when the print dialog is closed
//       onError: reject, // Reject the promise if there's an error
//     });
//   });
// }

// export function mergePDFs(pdf1: any, pdf2: any) {
//   // Create a new jsPDF instance
//   var mergedPDF = new jsPDF();

//   // Add the pages from the first PDF document
//   var pdf1NumPages = (pdf1 as any).internal.getNumberOfPages();
//   for (var i = 1; i <= pdf1NumPages; i++) {
//     var pdf1PageData = pdf1.internal.getPageData(i);
//     var pdf1Page = pdf1.internal.getPage(i);
//     mergedPDF.addPage(pdf1Page, pdf1PageData);
//   }

//   // Add the pages from the second PDF document
//   var pdf2NumPages = (pdf1 as any).internal.getNumberOfPages();
//   for (var j = 1; j <= pdf2NumPages; j++) {
//     var pdf2PageData = pdf2.internal.getPageData(j);
//     var pdf2Page = pdf2.internal.getPage(j);
//     mergedPDF.addPage(pdf2Page, pdf2PageData);
//   }

//   return mergedPDF;
// }
