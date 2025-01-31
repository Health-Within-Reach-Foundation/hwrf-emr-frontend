import React, { useEffect, useState } from "react";
import PlaygroundApp from "../Lexical-editor/App";
import html2pdf from "html2pdf.js";
import { mammoReportDefault } from "./mammography-report-template";
import { Button } from "antd";
import { RiFileDownloadLine, RiSave3Fill } from "@remixicon/react";
import { generatePath, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import patientServices from "../../api/patient-services";
import { Loading } from "../loading";

const MammoReportLexical = () => {
  const { mammographyId, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [mammoReport, setMammoReport] = useState(null);
  const [mammoHTMLReport, setMammoHTMLReport] = useState(null);

  // Fetch mammography details
  const fetchMammoDetails = async () => {
    try {
      setLoading(true);
      const response = await patientServices.getMammographyDetails(id);

      if (response.success) {
        const fetchedPatient = response.data;
        console.log("**********", fetchedPatient);
        const report =
          fetchedPatient.mammoReport &&
          Object.keys(fetchedPatient.mammoReport).length > 0
            ? fetchedPatient.mammoReport
            : JSON.stringify(
                mammoReportDefault(
                  `HWRF-${fetchedPatient.regNo}`,
                  fetchedPatient.name,
                  fetchedPatient.age
                )
              );

        setPatient(fetchedPatient);
        setMammoReport(report);
      } else {
        toast.error("Failed to fetch mammography details.");
      }
    } catch (error) {
      console.error("Error fetching mammography details: ", error);
      toast.error("Error while generating mammography report!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMammoDetails();
  }, []);

  // Download PDF function
  const downloadPDF = async () => {
    setIsDownloading(true);

    try {
      const fullHtml = `
        <html>
          <head>
           <title>${patient.name} - Mammography Report</title>
      <link rel="icon" href=${generatePath(
        "/assets/images/favicon.ico"
      )} type="image/x-icon"> 
    
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              .header, .footer {
                background: #f4f4f4;
                border: 1px solid #ccc;
                padding: 10px 20px;
                font-size: 14px;
              }
              .content {
                margin: 60px 0 50px;
                font-size: 12px;
                line-height: 1.6;
                color: #333;
              }
              .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 50px;
                color: rgba(0, 0, 0, 0.1);
                pointer-events: none;
                z-index: -1;
              }
            </style>
          </head>
          <body>
            <div class="watermark">HWRF</div>
            <div class="content">${mammoHTMLReport}</div>
          </body>
        </html>
      `;
      const blob = new Blob([fullHtml], { type: "text/html" });

      // Create an anchor tag to trigger the file download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = patient.mobile
        ? `${patient.name}(${patient.mobile}) Mammography Report.html`
        : `${patient.name} Mammography Report.html`;
      // ; // The filename for the downloaded file
      link.click(); // Programmatically trigger the download
      // const opt = {
      //   margin: 0.02,
      //   filename: patient.mobile
      //     ? `${patient.name}(${patient.mobile}) Mammography Report.pdf`
      //     : `${patient.name} Mammography Report.pdf`,
      //   image: { type: "jpeg", quality: 1 },
      //   html2canvas: { scale: 3, useCORS: true },
      //   jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      //   pagebreak: { mode: ["legacy", "avoid-all", "css"] },
      // };

      // const pdf = html2pdf().from(fullHtml).set(opt).toPdf();
      // console.log('fullHtml: ', fullHtml);

      // pdf.get("pdf").then((doc) => {
      //   const totalPages = doc.internal.getNumberOfPages();
      //   for (let i = 1; i <= totalPages; i++) {
      //     doc.setPage(i);
      //     doc.setFontSize(10);
      //   }
      // });
      toast.success(
        "Downloading the latest saved report. Unsaved changes in the editor won't be included."
      );
      // await pdf.save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await patientServices.updateMammographyDetails(id, {
        mammoReport: JSON.stringify(mammoReport),
      });
      if (response.success) {
        toast.success(response.message);
        // await onSave();
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error while saving mammography report!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(mammoReport);
  }, [mammoReport]);

  if (loading) {
    return <Loading />;
  }

  return mammoReport ? (
    <>
      <div className="d-flex gap-4">
        Name: <h4>{patient?.name || "N/A"}</h4>
        Reg No: <h4>{`HWRF- ${patient?.regNo}` || "N/A"}</h4>
      </div>
      <div className="d-flex flex-row-reverse mb-3 gap-2">
        <Button onClick={handleSave} loading={isDownloading}>
          <RiSave3Fill />
          Save
        </Button>
        <Button onClick={downloadPDF} loading={isDownloading}>
          <RiFileDownloadLine />
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
  ) : (
    <Loading />
  );
};

export default MammoReportLexical;
