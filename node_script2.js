const fs = require("fs");
const dicomParser = require("dicom-parser");

const buffer = fs.readFileSync("./public/assets/original/3DSlice1.dcm");

try {
  console.log("Buffer length:", buffer.length);
  console.log("First few bytes of buffer:", buffer.slice(0, 10).toString("hex")); // Inspect file header
  console.log("Bytes 128-132 (DICM check):", buffer.slice(128, 132).toString("hex")); // Check for DICM
  
  // Parse DICOM file
  const dataset = dicomParser.parseDicom(buffer);
  
  console.log("Dataset Elements:", Object.keys(dataset.elements));
  console.log("Transfer Syntax UID:", dataset.string("x00020010"));
  
  // Try accessing specific tags manually
  const pixelDataTag = dataset.elements["x7fe00010"];
  const imagePositionTag = dataset.string("x00200032");
  
  console.log("PixelData (7FE0,0010):", pixelDataTag);
  console.log("ImagePositionPatient (0020,0032):", imagePositionTag);
  
  // Extract and print pixel data if available
  if (pixelDataTag) {
    const pixelData = new Uint8Array(buffer.buffer, pixelDataTag.dataOffset, pixelDataTag.length);
    console.log("Pixel Data:", pixelData);
  } else {
    console.log("Pixel Data not found.");
  }
} catch (error) {
  console.error("Error parsing DICOM file:", error);
  console.log("Buffer content (hex preview):", buffer.slice(0, 128).toString("hex")); // Show more of the file
}
