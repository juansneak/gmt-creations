"use client";

import { useEffect, useRef, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

// Initialize Cornerstone
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// Configure WADO Image Loader
cornerstoneWADOImageLoader.configure({
  beforeSend: function (xhr) {
    xhr.setRequestHeader("Accept", "application/dicom");
  }
});

export default function DicomViewerThumbnails() {
  const dicomElementRef = useRef(null);
  const [imageIds, setImageIds] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  
  useEffect(() => {
    if (!dicomElementRef.current) return;
    
    cornerstone.enable(dicomElementRef.current);
    
    // Define preloaded DICOM files
    const dicomFiles = [
      "/assets/skull/series-000001/image-000001.dcm",
      "/assets/skull/series-000002/image-000001.dcm",
      "/assets/skull/series-000003/image-000001.dcm",
      "/assets/skull/series-000004/image-000001.dcm"
    ];
    
    // Convert file paths to image IDs
    const newImageIds = dicomFiles.map(file =>
      `wadouri:${window.location.origin}${file}`
    );
    
    setImageIds(newImageIds);
  }, []);
  
  useEffect(() => {
    if (imageIds.length > 0) {
      loadDicomImage(selectedImage);
    }
  }, [imageIds, selectedImage]);
  
  const loadDicomImage = async (index) => {
    if (!dicomElementRef.current || !imageIds[index]) return;
    
    try {
      const image = await cornerstone.loadImage(imageIds[index]);
      cornerstone.displayImage(dicomElementRef.current, image);
    } catch (error) {
      console.error("Error loading DICOM image:", error);
    }
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar with Thumbnails */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Dicom Viewer</h3>
        <h3 className="text-lg font-semibold mb-4">Series:</h3>
        <div className="flex flex-col gap-2">
          {imageIds.map((imageId, index) => (
            <div
              key={index}
              className={`p-2 border rounded cursor-pointer ${
                selectedImage === index ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <span>Image {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Viewer */}
      <div className="flex-1 flex items-center justify-center">
        <div
          ref={dicomElementRef}
          className="w-[512px] h-[512px] border border-gray-500"
        />
      </div>
    </div>
  );
}
