const fs = require("fs");
const dcmjs = require("dcmjs");

const buffer = fs.readFileSync("./public/assets/original/3DSlice1.dcm");

// Convert Buffer to ArrayBuffer
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

try {
  console.log("Buffer length:", buffer.length);
  console.log("ArrayBuffer length:", arrayBuffer.byteLength);
  console.log("First few bytes of buffer:", buffer.slice(0, 10).toString("hex")); // Inspect file header
  console.log("Bytes 128-132 (DICM check):", buffer.slice(128, 132).toString("hex")); // Check for DICM
  
  const dataset = dcmjs.data.DicomMessage.readFile(arrayBuffer);
  console.log("Raw Dataset:", dataset); // Log raw dataset before naturalization
  
  const naturalized = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dataset);
  console.log("Naturalized Dataset:", JSON.stringify(naturalized, null, 2));
  console.log("Keys:", Object.keys(naturalized));
  
  // Try accessing specific tags manually
  const pixelDataTag = dataset.dict["7FE0,0010"];
  const imagePositionTag = dataset.dict["0020,0032"];
  console.log("PixelData (7FE0,0010):", pixelDataTag);
  console.log("ImagePositionPatient (0020,0032):", imagePositionTag);
} catch (error) {
  console.error("Error parsing DICOM file:", error);
  console.log("Buffer content (hex preview):", buffer.slice(0, 128).toString("hex")); // Show more of the file
}
