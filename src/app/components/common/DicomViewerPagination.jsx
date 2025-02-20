"use client";

import { useEffect, useRef, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

// Initialize Cornerstone WADO Image Loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// Configure the loader to use Web Workers
cornerstoneWADOImageLoader.configure({
  beforeSend: function (xhr) {
    xhr.setRequestHeader("Accept", "application/dicom");
  }
});

export default function DicomViewerPagination() {
  const dicomElementRef = useRef(null);
  const [imageIds, setImageIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
    
    // Convert file paths to image IDs using wadouri
    const newImageIds = dicomFiles.map(file =>
      `wadouri:${window.location.origin}${file}`
    );
    
    setImageIds(newImageIds);
  }, []);
  
  useEffect(() => {
    if (imageIds.length > 0) {
      loadDicomImage(currentIndex);
    }
  }, [imageIds, currentIndex]);
  
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
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold" style={{marginTop: '20px'}}>DICOM Viewer</h2>
      <div
        ref={dicomElementRef}
        className="w-[512px] h-[512px] border border-gray-500"
      />
      {imageIds.length > 1 && (
        <div className="flex gap-4">
          <button
            className="px-4 py-2 border rounded"
            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 border rounded"
            onClick={() => setCurrentIndex(prev => Math.min(prev + 1, imageIds.length - 1))}
            disabled={currentIndex === imageIds.length - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
