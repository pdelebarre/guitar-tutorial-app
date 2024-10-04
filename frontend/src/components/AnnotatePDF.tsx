import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { Button, Box } from "@mui/material";
const AnnotatePDF = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Function to annotate the PDF
  const annotatePDF = async () => {
    if (!pdfFile) return;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Get the first page of the PDF
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Add text annotation
    firstPage.drawText("This is an annotation!", {
      x: 50,
      y: 500,
      size: 24,
      color: rgb(0, 0, 1), // Blue color
    });

    // Add rectangle highlight
    firstPage.drawRectangle({
      x: 50,
      y: 450,
      width: 200,
      height: 100,
      borderColor: rgb(1, 0, 0), // Red border
      borderWidth: 2,
    });

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Save the modified PDF
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "annotated.pdf");
  };

  return (
    <Box>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={annotatePDF}
        disabled={!pdfFile}
      >
        Annotate PDF
      </Button>
    </Box>
  );
};

export default AnnotatePDF;
