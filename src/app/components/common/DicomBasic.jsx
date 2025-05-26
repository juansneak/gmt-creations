"use client";

import { useEffect, useRef, useState } from "react";

export default function DicomBasic() {
  const dicomElementRef = useRef(null);
  const [imageId, setImageId] = useState(null);
  const [frameCount, setFrameCount] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [cornerstone, setCornerstone] = useState(null);
  const [cornerstoneWADOImageLoader, setCornerstoneWADOImageLoader] = useState(null);
  const [dicomParser, setDicomParser] = useState(null);
  
  useEffect(() => {
    // Dynamically import libraries
    Promise.all([
      import("cornerstone-core"),
      import("cornerstone-wado-image-loader"),
      import("dicom-parser"),
    ]).then(([cornerstoneModule, wadoModule, dicomParserModule]) => {
      setCornerstone(cornerstoneModule.default);
      setCornerstoneWADOImageLoader(wadoModule.default);
      setDicomParser(dicomParserModule.default);
    });
  }, []);
  
  useEffect(() => {
    if (!dicomElementRef.current || !cornerstone || !cornerstoneWADOImageLoader || !dicomParser) return;
    
    // Initialize Cornerstone WADO Image Loader
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    
    cornerstoneWADOImageLoader.configure({
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Accept", "application/dicom");
      },
    });
    
    // Enable Cornerstone for the DICOM element
    cornerstone.enable(dicomElementRef.current);
    
    // Set imageId for the DICOM file
    const dicomFile = "/assets/original.dcm";
    const newImageId = `wadouri:${window.location.origin}${dicomFile}`;
    setImageId(newImageId);
    
    // Cleanup Cornerstone when component unmounts
    return () => {
      cornerstone.disable(dicomElementRef.current);
    };
  }, [cornerstone, cornerstoneWADOImageLoader, dicomParser]);
  
  useEffect(() => {
    if (!imageId || !dicomElementRef.current || !cornerstone) return;
    
    const loadDicomImage = async (frame = 0) => {
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
    
    loadDicomImage(currentFrame);
  }, [imageId, currentFrame, cornerstone]);
  
  const handleMouseScroll = (event) => {
    event.preventDefault();
    if (frameCount <= 1) return;
    
    const delta = event.deltaY > 0 ? 2 : -2;
    setCurrentFrame((prev) => Math.max(0, Math.min(frameCount - 1, prev + delta)));
  };
  
  const handleMouseDown = (event) => {
    setIsMouseDown(true);
    setLastMouseY(event.clientY);
  };
  
  const handleMouseMove = (event) => {
    if (!isMouseDown) return;
    
    const deltaY = event.clientY - lastMouseY;
    if (Math.abs(deltaY) > 10) {
      const direction = deltaY > 0 ? 3 : -3;
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
    
    element.addEventListener("wheel", handleMouseScroll);
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      element.removeEventListener("wheel", handleMouseScroll);
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseup", handleMouseUp);
    };
  }, [frameCount, isMouseDown]);
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={dicomElementRef}
        className="w-[512px] h-[512px]"
      />
      {/*<p>Frame: {currentFrame + 1} / {frameCount}</p>*/}
    </div>
  );
}
