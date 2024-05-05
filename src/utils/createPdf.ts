import {
  invoicePdfConfigEn,
  invoicePdfConfigKh,
  prescriptionPdfConfigEn,
  prescriptionPdfConfigKh,
} from "./config";
import path from "path";

interface Prescriptiondata {
  prescription: { medicine: string; amount: number; usage: string }[];
  name: string;
  sex: string;
  age: number;
  diagnosis: string;
  date: string;
}

interface InvoiceData {
  name: string;
  invoiceNo: string;
  sex: string;
  age: number;
  date: string;
  prescription: { medicine: string; amount: number; price: number }[];
}

// function addFonts(doc) {
//   doc.addFileToVFS("Khmer-Regular-normal.ttf", font);
//   doc.addFont("Khmer-Regular-normal.ttf", "Khmer-Regular", "normal");
// }

function formatDateKh(date: string) {
  const [year, month, day] = date.split("-");
  return `ថ្ងៃទី ${day} ខែ ${month} ឆ្នាំ ${year}`;
}

export const createPrescriptionPdf = async (
  doc: any,
  language: "kh" | "en",
  { prescription, name, sex, age, diagnosis, date }: Prescriptiondata
) => {
  const { content, ...prescriptionPdfConfig } =
    language === "kh" ? prescriptionPdfConfigKh : prescriptionPdfConfigEn;
  const { margin, spacing, titleFontSize, normalFontSize, subTitleFontSize } =
    prescriptionPdfConfig;

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
    .text(`${content.sexLabel}${sex}`, xPos)
    .moveUp(1);
  xPos = pageWidth * 0.75;
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(`${content.ageLabel}${age} ឆ្នាំ`, xPos);

  doc.moveDown(0.5);
  // second row
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(`${content.diagnosisLabel}${diagnosis}`, margin);

  // Draw line
  xPos = doc.page.margins.left;
  yPos = doc.y;
  doc
    .moveTo(xPos, yPos)
    .lineTo(pageWidth - xPos, yPos)
    .stroke();

  // prescription section
  const { prescriptionLabel } = content;

  // prescription title
  doc
    .fontSize(subTitleFontSize)
    .font(prescriptionPdfConfig.khFont)
    .text(prescriptionLabel.title, xPos, doc.y, {
      align: "center",
      underline: true,
    });

  // prescription medicine title
  doc.fontSize(normalFontSize);
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(prescriptionLabel.medicine, { underline: true })
    .moveUp(1);
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(prescriptionLabel.amount, { align: "center", underline: true })
    .moveUp(1);
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(prescriptionLabel.usage, pageWidth / 2, doc.y, {
      align: "center",
      underline: true,
    });
  doc.moveDown(0.5);

  // medicine
  prescription.forEach((item, index) => {
    doc
      .font(prescriptionPdfConfig.enFont)
      .text(`${index + 1}-`, 0, doc.y, { align: "right", width: margin })
      .moveUp(1);
    xPos = margin;
    doc.font(prescriptionPdfConfig.enFont).text(item.medicine, xPos).moveUp(1);
    doc
      .font(prescriptionPdfConfig.khFont)
      .text(`${item.amount.toString()} គ្រាប់`, { align: "center" })
      .moveUp(1);
    doc
      .font(prescriptionPdfConfig.khFont)
      .text(item.usage, pageWidth / 2, doc.y, {
        align: "center",
      });
    doc.moveDown(1);
  });
  // date
  yPos = doc.page.height - 150;
  xPos = margin;
  doc
    .font(prescriptionPdfConfig.khFont)
    .text(formatDateKh(date), xPos, yPos, { align: "right" });

  // footer
  yPos = doc.page.height - doc.page.margins.bottom - 16;
  xPos = margin;
  doc.fontSize(normalFontSize);
  doc.font(prescriptionPdfConfig.khFont).text(content.bottomText, xPos, yPos);
  return;
};

export const createInvoicePdf = async (
  doc: any,
  language: "kh" | "en",
  { name, invoiceNo, sex, age, date, prescription }: InvoiceData
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

  // title
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
    .text(`${content.genderLabel}${sex}`, xPos, yPos)
    .moveUp(1);
  xPos = pageWidth * 0.375;
  doc
    .font(invoicePdfConfig.khFont)
    .text(`${content.ageLabel}${age}`, xPos)
    .moveUp(1);

  xPos = pageWidth * 0.625;
  doc
    .font(invoicePdfConfig.khFont)
    .text(`${content.dateLabel}${date}`, xPos, doc.y);
  doc.moveDown(1);

  // prescription
  const { prescriptionLabel } = content;
  const cellWidth = [33, 169, 33, 66, 70];
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

  prescription.map((med, index) => {
    let yPos = doc.y;
    doc
      .text(index + 1, cellXPos[0], yPos, {
        width: cellWidth[0],
        align: "center",
      })
      .text(med.medicine, cellXPos[1], yPos, {
        width: cellWidth[1],
        align: "left",
      })
      .text(med.amount, cellXPos[2], yPos, {
        width: cellWidth[2],
        align: "center",
      })
      .text(med.price + " ៛", cellXPos[3], yPos, {
        width: cellWidth[3],
        align: "center",
      })
      .text(med.price * med.amount + " ៛", cellXPos[4], yPos, {
        width: cellWidth[4],
        align: "center",
      });
    cellYPos.push(doc.y);
  });
  doc
    .moveTo(cellXPos[0], doc.y)
    .lineTo(cellXPos[4] + cellWidth[4], doc.y)
    .stroke();

  const totalAmount = prescription.reduce((acc: number, item: any) => {
    return acc + item.amount * item.price;
  }, 0);
  doc
    .fontSize(8)
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
  yPos = doc.page.height - 100;
  xPos = doc.page.width - margin - 200;
  doc
    .moveTo(xPos, yPos)
    .lineTo(xPos + 200, yPos)
    .stroke();
  doc.text(content.SignatureLabel, xPos, yPos, { align: "center", width: 200 });

  // footer
  yPos = doc.page.height - margin - 32;
  xPos = margin;
  doc.text(content.footer, xPos, yPos, { align: "center" });

  // logo
  xPos = margin;
  yPos = 8;
  doc.image(path.resolve("./public/logo.jpg"), xPos, yPos, {
    width: 60,
  });
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
