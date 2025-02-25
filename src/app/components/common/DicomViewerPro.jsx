"use client";

import { useEffect, useRef, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

// Initialize Cornerstone WADO Image Loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneWADOImageLoader.configure({
  beforeSend: function (xhr) {
    xhr.setRequestHeader("Accept", "application/dicom");
  },
});

export default function DicomViewerPro() {
  const dicomElementRef = useRef(null);
  const [imageId, setImageId] = useState(null);
  const [frameCount, setFrameCount] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);
  
  // Use useEffect to avoid using window on SSR
  useEffect(() => {
    if (!dicomElementRef.current) return;
    
    cornerstone.enable(dicomElementRef.current);
    
    // Safely access window inside useEffect (only client-side)
    if (typeof window !== "undefined") {
      const dicomFile = "/assets/original.dcm";
      const newImageId = `wadouri:${window.location.origin}${dicomFile}`;
      setImageId(newImageId);
    }
  }, []);
  
  useEffect(() => {
    if (imageId) {
      loadDicomImage(currentFrame);
    }
  }, [imageId, currentFrame]);
  
  const loadDicomImage = async (frame = 0) => {
    if (!dicomElementRef.current || !imageId) return;
    
    try {
      const image = await cornerstone.loadImage(`${imageId}?frame=${frame}`);
      cornerstone.displayImage(dicomElementRef.current, image);
      
      // Get frame count from metadata
      if (frame === 0) {
        const totalFrames = image.data.string("x00280008");
        setFrameCount(totalFrames ? parseInt(totalFrames, 10) : 1);
      }
    } catch (error) {
      console.error("Error loading DICOM image:", error);
    }
  };
  
  const handleMouseScroll = (event) => {
    event.preventDefault();
    if (frameCount <= 1) return;
    
    // Increase the scroll speed by a factor (e.g., 2x)
    const delta = event.deltaY > 0 ? 2 : -2;
    setCurrentFrame((prev) => Math.max(0, Math.min(frameCount - 1, prev + delta)));
  };
  
  const handleMouseDown = (event) => {
    setIsMouseDown(true);
    setLastMouseY(event.clientY);
  };
  
  const handleMouseMove = (event) => {
    if (!isMouseDown) return;
    
    // Increase the drag speed by a factor (e.g., 3x)
    const deltaY = event.clientY - lastMouseY;
    if (Math.abs(deltaY) > 10) {
      const direction = deltaY > 0 ? 3 : -3; // Increase the factor for faster speed
      setCurrentFrame((prev) => Math.max(0, Math.min(frameCount - 1, prev + direction)));
      setLastMouseY(event.clientY);
    }
  };
  
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };
  
  useEffect(() => {
    const element = dicomElementRef.current;
    if (!element) return;
    
    // Add event listeners for mouse scroll and dragging
    element.addEventListener("wheel", handleMouseScroll);
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseup", handleMouseUp);
    
    // Cleanup event listeners
    return () => {
      element.removeEventListener("wheel", handleMouseScroll);
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseup", handleMouseUp);
    };
  }, [frameCount, isMouseDown]);
  
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold mt-5">DICOM Viewer</h2>
      <div
        ref={dicomElementRef}
        className="w-[512px] h-[512px] border border-gray-500"
      />
      <p>Frame: {currentFrame + 1} / {frameCount}</p>
    </div>
  );
}
