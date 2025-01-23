import React, { useEffect, useState } from "react";
import PlaygroundApp from "../Lexical-editor/App";
import html2pdf from "html2pdf.js";

import { mammoReportDefault } from "./mammography-report-template";
import { Button } from "antd";
import { RiFileDownloadLine } from "@remixicon/react";
const MammoReportLexical = ({ patient }) => {
  console.log("patient inside mammo report editor: ", patient);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mammoReport, setMammoReport] = useState(
    JSON.stringify(
      mammoReportDefault
        ? mammoReportDefault(
            `HWRF- ${patient.regNo}`,
            patient.name,
            patient.age,
            patient.sex,
            patient.email,
            patient.address,
            patient.mobile
            // patient.gender
          )
        : {}
    )
  );
  const [mammoHTMLReport, setMammoHTMLReport] = useState();
  useEffect(() => {
    console.log(mammoReport);
  }, [mammoReport]);
  //   const downloadPDF = async () => {
  //     setIsDownloading(true);
  //     try {
  //       const todayDate = new Date().toLocaleDateString();

  //       const fullHtml = `
  //       <html>
  //         <head>
  //           <style>
  //             body {
  //               margin: 0;
  //               padding: 0;
  //               font-family: Arial, sans-serif;
  //             }

  //             .header {
  //               position: absolute;
  //               top: 0;
  //               left: 0;
  //               width: 100%;
  //               height: 40px;
  //               padding: 10px 20px;
  //               font-size: 14px;
  //               font-weight: bold;
  //               color: #333333;
  //               display: flex;
  //               justify-content: space-between;
  //               align-items: center;
  //             }
  //             .footer {
  //               position: absolute;
  //               bottom: 0;
  //               left: 0;
  //               width: 100%;
  //               height: 30px;
  //               font-size: 10px;
  //               display: flex;
  //               justify-content: space-between;
  //               align-items: center;
  //               border-top: 1px solid black;
  //               padding: 5px 20px;
  //               box-sizing: border-box;
  //             }
  //             .content {

  //               line-height: 1.6;
  //               font-size: 12px;
  //               color: #333333;
  //               box-sizing: border-box;
  //             }
  //             .watermark {
  //               position: fixed;
  //               top: 50%;
  //               left: 50%;
  //               transform: translate(-50%, -50%) rotate(-45deg);
  //               font-size: 50px;
  //               color: rgba(0, 0, 0, 0.1);
  //               z-index: -1;
  //               pointer-events: none;
  //               text-align: center;
  //             }

  //           </style>
  //         </head>
  //         <body>
  //           <div class="watermark">${"HWRF"}</div>
  //           <div class="page">

  //             <div class="content">
  //               ${mammoHTMLReport}
  //             </div>

  //           </div>
  //         </body>
  //       </html>
  //     `;

  //       const opt = {
  //         margin: 0,
  //         filename: patient.mobile
  //           ? `${patient.name}_${patient.mobile} MammoGraphyReport .pdf`
  //           : `${patient.name} MammoGraphyReport.pdf`,
  //         image: { type: "jpeg", quality: 1 },
  //         html2canvas: {
  //           scale: 3,
  //           useCORS: true,
  //         },
  //         jsPDF: {
  //           unit: "mm",
  //           format: "a4",
  //           orientation: "portrait",
  //         },
  //         pagebreak: { mode: "page-break" }, // Automatically handle page breaks for large content
  //       };

  //       // Generate PDF using html2pdf
  //       const pdf = html2pdf().from(fullHtml).set(opt).toPdf();

  //       // Custom page numbering logic
  //       pdf.get("pdf").then((doc) => {
  //         const totalPages = doc.internal.getNumberOfPages();

  //         const footerHeight = 30; // Footer height in mm
  //         const bottomMargin = 10; // Bottom margin for space before footer

  //         for (let i = 1; i <= totalPages; i++) {
  //           doc.setPage(i);
  //           doc.setFontSize(12);

  //         //   doc.text(
  //         //     `${patient.name}`,
  //         //     10, // X-axis position (left alignment)
  //         //     15, // Y-axis position (top margin)
  //         //     { align: "left" }
  //         //   );
  //         //   // Add Header: Today's Date on the right
  //         //   doc.text(
  //         //     `${todayDate}`,
  //         //     200, // X-axis position (right alignment for A4 width)
  //         //     15, // Y-axis position (top margin)
  //         //     { align: "right" }
  //         //   );
  //           // Estimate content height (you can adjust this depending on the actual content)
  //           // Calculate the remaining space before the footer
  //           const contentHeight =
  //             doc.getTextDimensions(`${patient.name} `).h +
  //             doc.getTextDimensions(`${todayDate}`).h;
  //           const remainingSpace =
  //             297 - footerHeight - bottomMargin - contentHeight;

  //           // If remaining space is too small, we need to add a page break
  //           if (remainingSpace < 0) {
  //             // Add a page break before the footer
  //             doc.addPage(); // Create a new page
  //             doc.setPage(i + 1); // Move to the next page
  //           }

  //           // Footer: Page Number on the Right
  //           doc.setFontSize(10);
  //           doc.text(`Page ${i} of ${totalPages}`, 200, 287, { align: "right" }); // Footer right

  //           // Footer: Copyright on the Left
  //           doc.text("© Copyright 2025 HWRF, all rights reserved.", 10, 287, {
  //             align: "left",
  //           }); // Footer left
  //           // Optional: Add a border box for the content if needed
  //         //   doc.setDrawColor(0); // Black border
  //         //   doc.rect(10, 20, 190, 257); // (x, y, width, height) to fit A4 size
  //         }
  //       });

  //       pdf.save();
  //       setIsDownloading(false);
  //     } catch (error) {
  //       console.log("error: ", error);
  //       //   toast.error("Error generating PDF");
  //       setIsDownloading(false);
  //     }
  //   };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const fullHtml = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .header {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 40px;
              padding: 10px 20px;
              font-size: 14px;
              font-weight: bold;
              color: #333;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #f4f4f4;
              border-bottom: 1px solid #ccc;
            }
            .footer {
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 30px;
              font-size: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 5px 20px;
              box-sizing: border-box;
              border-top: 1px solid #ccc;
              background: #f4f4f4;
            }
            .content {
              margin-top: 60px; /* Adjust for header height */
              margin-bottom: 50px; /* Adjust for footer height */
              line-height: 1.6;
              font-size: 12px;
              color: #333;
              box-sizing: border-box;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 50px;
              color: rgba(0, 0, 0, 0.1);
              z-index: -1;
              pointer-events: none;
              text-align: center;
            }
           
          </style>
        </head>
        <body>
          <div class="watermark">${"HWRF"}</div>
          <div class="content">
            ${mammoHTMLReport}
          </div>
          
        </body>
      </html>
      `;

      const opt = {
        margin: 0.02, // Margins set to 0 to let custom CSS handle spacing
        filename: patient.mobile
          ? `${patient.name}(${patient.mobile}) Mammography Report.pdf`
          : `${patient.name} Mammography Report.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
        // pagebreak: { mode: ["avoid-all"] },
        pagebreak: { mode: ["legacy", "avoid-all", "css"] },
      };

      // Generate PDF using html2pdf
      const pdf = html2pdf().from(fullHtml).set(opt).toPdf();

      // Add page numbers dynamically
      pdf.get("pdf").then((doc) => {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          //   doc.text(
          //     `Page ${i} of ${totalPages}`,
          //     doc.internal.pageSize.width - 20,
          //     doc.internal.pageSize.height - 10,
          //     { align: "right" }
          //   );
        }
      });

      await pdf.save();
      setIsDownloading(false);
    } catch (error) {
      console.log("Error generating PDF:", error);
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-row-reverse mb-3">
        <Button onClick={downloadPDF} loading={isDownloading} className=" ">
        <RiFileDownloadLine/>
          Download Report
        </Button>
      </div>
      <PlaygroundApp
        defaultEditorContent={mammoReport}
        setEditorContent={setMammoReport}
        setHtmlToDownload={setMammoHTMLReport}
        editable={true}
      />
    </>
  );
};

export default MammoReportLexical;
