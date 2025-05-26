"use client";

export const dynamic = "force-dynamic";

import React, { useRef, useEffect } from "react";

export default function DicomViewer() {
  const contentRef = useRef(null);
  
  useEffect(() => {
    const initialize = async () => {
      const [
        { default: cornerstone, Types, RenderingEngine, Enums, setVolumesForViewports, volumeLoader, getRenderingEngine },
        {
          ToolGroupManager,
          Enums: csToolsEnums,
          WindowLevelTool,
          PanTool,
          ZoomTool,
          StackScrollTool,
          synchronizers,
          MIPJumpToClickTool,
          CrosshairsTool,
          TrackballRotateTool,
          VolumeRotateTool,
        },
        {
          initDemo,
          createImageIdsAndCacheMetaData,
          setTitleAndDescription,
          setPetColorMapTransferFunctionForVolumeActor,
          setPetTransferFunctionForVolumeActor,
          setCtTransferFunctionForVolumeActor,
          addDropdownToToolbar,
          addButtonToToolbar,
        },
      ] = await Promise.all([
        import("@cornerstonejs/core"),
        import("@cornerstonejs/tools"),
        import("../../utils/demo/helpers"),
      ]);
      
      console.log("TOOL GROUP MANAGER!!!!");
      console.log(ToolGroupManager);
      
      const { MouseBindings } = csToolsEnums;
      const { ViewportType } = Enums;
      const { createCameraPositionSynchronizer, createVOISynchronizer } = synchronizers;
      
      let renderingEngine;
      const wadoRsRoot = "http://localhost/dicom-web";
      const StudyInstanceUID = "1.2.250.1.90.4.4205557061.20250224172620.11064.1";
      
      const renderingEngineId = "myRenderingEngine";
      const volumeLoaderScheme = "cornerstoneStreamingImageVolume";
      const ctVolumeName = "CT_VOLUME_ID";
      const ctVolumeId = `${volumeLoaderScheme}:${ctVolumeName}`;
      const ptVolumeName = "PT_VOLUME_ID";
      const ptVolumeId = `${volumeLoaderScheme}:${ptVolumeName}`;
      const ctToolGroupId = "CT_TOOLGROUP_ID";
      const ptToolGroupId = "PT_TOOLGROUP_ID";
      const fusionToolGroupId = "FUSION_TOOLGROUP_ID";
      const mipToolGroupUID = "MIP_TOOLGROUP_ID";
      let ctImageIds;
      let ptImageIds;
      let ctVolume;
      let ptVolume;
      const axialCameraSynchronizerId = "AXIAL_CAMERA_SYNCHRONIZER_ID";
      const sagittalCameraSynchronizerId = "SAGITTAL_CAMERA_SYNCHRONIZER_ID";
      const coronalCameraSynchronizerId = "CORONAL_CAMERA_SYNCHRONIZER_ID";
      const ctVoiSynchronizerId = "CT_VOI_SYNCHRONIZER_ID";
      const ptVoiSynchronizerId = "PT_VOI_SYNCHRONIZER_ID";
      const fusionVoiSynchronizerId = "FUSION_VOI_SYNCHRONIZER_ID";
      let axialCameraPositionSynchronizer;
      let sagittalCameraPositionSynchronizer;
      let coronalCameraPositionSynchronizer;
      let ctVoiSynchronizer;
      let ptVoiSynchronizer;
      let fusionVoiSynchronizer;
      let mipToolGroup;
      const viewportIds = {
        CT: { AXIAL: "CT_AXIAL", SAGITTAL: "CT_SAGITTAL", CORONAL: "CT_CORONAL" },
      };
      
      // ======== Set up page ======== //
      setTitleAndDescription(
        "PET-CT",
        "PT-CT fusion layout with Crosshairs, and synchronized cameras, CT W/L and PET threshold"
      );
      
      const optionsValues = [WindowLevelTool.toolName, CrosshairsTool.toolName];
      
      addDropdownToToolbar({
        options: { values: optionsValues, defaultValue: WindowLevelTool.toolName },
        onSelectedValueChange: (toolNameAsStringOrNumber) => {
          const toolName = String(toolNameAsStringOrNumber);
          [ctToolGroupId, ptToolGroupId, fusionToolGroupId].forEach((toolGroupId) => {
            const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
            if (!toolGroup) return; // Skip if tool group doesn't exist
            if (toolName === WindowLevelTool.toolName) {
              toolGroup.setToolPassive(CrosshairsTool.toolName);
              toolGroup.setToolActive(WindowLevelTool.toolName, {
                bindings: [{ mouseButton: MouseBindings.Primary }],
              });
            } else {
              toolGroup.setToolDisabled(WindowLevelTool.toolName);
              toolGroup.setToolActive(CrosshairsTool.toolName, {
                bindings: [{ mouseButton: MouseBindings.Primary }],
              });
            }
          });
        },
      });
      
      const resizeObserver = new ResizeObserver(() => {
        console.log("Size changed");
        renderingEngine = getRenderingEngine(renderingEngineId);
        if (renderingEngine) {
          renderingEngine.resize(true, false);
        }
      });
      
      const viewportGrid = document.createElement("div");
      viewportGrid.style.display = "grid";
      viewportGrid.style.gridTemplateRows = `[row1-start] 100% [row2-start] 0% [row3-start] 0% [end]`;
      viewportGrid.style.gridTemplateColumns = `[col1-start] 33% [col2-start] 33% [col3-start] 33% [col4-start] 0% [col5-start] 0%[end]`;
      viewportGrid.style.width = "100vw";
      viewportGrid.style.height = "80vh";
      
      const content = document.getElementById("content");
      content.innerHTML = ""; // Clear previous content
      content.appendChild(viewportGrid);
      
      const element1_1 = document.createElement("div");
      const element1_2 = document.createElement("div");
      const element1_3 = document.createElement("div");
      const element_mip = document.createElement("div");
      
      element1_1.style.gridColumnStart = "1";
      element1_1.style.gridRowStart = "1";
      element1_2.style.gridColumnStart = "2";
      element1_2.style.gridRowStart = "1";
      element1_3.style.gridColumnStart = "3";
      element1_3.style.gridRowStart = "1";
      element_mip.style.gridColumnStart = "4";
      element_mip.style.gridRowStart = "1";
      element_mip.style.gridRowEnd = "span 3";
      
      viewportGrid.appendChild(element1_1);
      viewportGrid.appendChild(element1_2);
      viewportGrid.appendChild(element1_3);
      viewportGrid.appendChild(element_mip);
      
      const elements = [element1_1, element1_2, element1_3];
      
      elements.forEach((element) => {
        element.style.width = "100%";
        element.style.height = "100%";
        element.oncontextmenu = (e) => e.preventDefault();
        resizeObserver.observe(element);
      });
      
      element_mip.style.width = "100%";
      element_mip.style.height = "100%";
      element_mip.oncontextmenu = (e) => e.preventDefault();
      resizeObserver.observe(element_mip);
      
      const viewportColors = {
        [viewportIds.CT.AXIAL]: "rgb(200, 0, 0)",
        [viewportIds.CT.SAGITTAL]: "rgb(200, 200, 0)",
        [viewportIds.CT.CORONAL]: "rgb(0, 200, 0)",
      };
      
      const viewportReferenceLineControllable = [
        viewportIds.CT.AXIAL,
        viewportIds.CT.SAGITTAL,
        viewportIds.CT.CORONAL,
      ];
      
      const viewportReferenceLineDraggableRotatable = [
        viewportIds.CT.AXIAL,
        viewportIds.CT.SAGITTAL,
        viewportIds.CT.CORONAL,
      ];
      
      const viewportReferenceLineSlabThicknessControlsOn = [
        viewportIds.CT.AXIAL,
        viewportIds.CT.SAGITTAL,
        viewportIds.CT.CORONAL,
      ];
      
      function getReferenceLineColor(viewportId) {
        return viewportColors[viewportId];
      }
      
      function getReferenceLineControllable(viewportId) {
        return viewportReferenceLineControllable.includes(viewportId);
      }
      
      function getReferenceLineDraggableRotatable(viewportId) {
        return viewportReferenceLineDraggableRotatable.includes(viewportId);
      }
      
      function getReferenceLineSlabThicknessControlsOn(viewportId) {
        return viewportReferenceLineSlabThicknessControlsOn.includes(viewportId);
      }
      
      function setUpToolGroups() {
        // Add tools to Cornerstone3D
        cornerstoneTools.addTool(WindowLevelTool);
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.addTool(ZoomTool);
        cornerstoneTools.addTool(StackScrollTool);
        cornerstoneTools.addTool(MIPJumpToClickTool);
        cornerstoneTools.addTool(CrosshairsTool);
        cornerstoneTools.addTool(TrackballRotateTool);
        cornerstoneTools.addTool(VolumeRotateTool);
        
        // Check for existing tool groups and destroy them
        [ctToolGroupId, ptToolGroupId, fusionToolGroupId, mipToolGroupUID].forEach((toolGroupId) => {
          const existingToolGroup = ToolGroupManager.getToolGroup(toolGroupId);
          if (existingToolGroup) {
            ToolGroupManager.destroyToolGroup(toolGroupId);
          }
        });
        
        const ctToolGroup = ToolGroupManager.createToolGroup(ctToolGroupId);
        const ptToolGroup = ToolGroupManager.createToolGroup(ptToolGroupId);
        const fusionToolGroup = ToolGroupManager.createToolGroup(fusionToolGroupId);
        
        if (!ctToolGroup || !ptToolGroup || !fusionToolGroup) {
          console.error("Failed to create one or more tool groups");
          return;
        }
        
        ctToolGroup.addViewport(viewportIds.CT.AXIAL, renderingEngineId);
        ctToolGroup.addViewport(viewportIds.CT.SAGITTAL, renderingEngineId);
        ctToolGroup.addViewport(viewportIds.CT.CORONAL, renderingEngineId);
        
        [ctToolGroup, ptToolGroup].forEach((toolGroup) => {
          toolGroup.addTool(PanTool.toolName);
          toolGroup.addTool(ZoomTool.toolName);
          toolGroup.addTool(StackScrollTool.toolName);
          toolGroup.addTool(CrosshairsTool.toolName, {
            getReferenceLineColor,
            getReferenceLineControllable,
            getReferenceLineDraggableRotatable,
            getReferenceLineSlabThicknessControlsOn,
          });
        });
        
        fusionToolGroup.addTool(PanTool.toolName);
        fusionToolGroup.addTool(ZoomTool.toolName);
        fusionToolGroup.addTool(StackScrollTool.toolName);
        fusionToolGroup.addTool(CrosshairsTool.toolName, {
          getReferenceLineColor,
          getReferenceLineControllable,
          getReferenceLineDraggableRotatable,
          getReferenceLineSlabThicknessControlsOn,
          filterActorUIDsToSetSlabThickness: [ctVolumeId],
        });
        
        ctToolGroup.addTool(WindowLevelTool.toolName);
        ptToolGroup.addTool(WindowLevelTool.toolName);
        fusionToolGroup.addTool(WindowLevelTool.toolName);
        
        [ctToolGroup, ptToolGroup, fusionToolGroup].forEach((toolGroup) => {
          toolGroup.setToolActive(WindowLevelTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Primary }],
          });
          toolGroup.setToolActive(PanTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Auxiliary }],
          });
          toolGroup.setToolActive(ZoomTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Secondary }],
          });
          toolGroup.setToolActive(StackScrollTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Wheel }],
          });
          toolGroup.setToolPassive(CrosshairsTool.toolName);
        });
        
        mipToolGroup = ToolGroupManager.createToolGroup(mipToolGroupUID);
        if (!mipToolGroup) {
          console.error("Failed to create MIP tool group");
          return;
        }
        
        mipToolGroup.addTool(VolumeRotateTool.toolName);
        mipToolGroup.setToolActive(VolumeRotateTool.toolName, {
          bindings: [{ mouseButton: MouseBindings.Wheel }],
        });
        mipToolGroup.addTool(MIPJumpToClickTool.toolName, {
          toolGroupId: ptToolGroupId,
        });
        
        mipToolGroup.setToolActive(MIPJumpToClickTool.toolName, {
          bindings: [{ mouseButton: MouseBindings.Primary }],
        });
      }
      
      function setUpSynchronizers() {
        axialCameraPositionSynchronizer = createCameraPositionSynchronizer(axialCameraSynchronizerId);
        sagittalCameraPositionSynchronizer = createCameraPositionSynchronizer(sagittalCameraSynchronizerId);
        coronalCameraPositionSynchronizer = createCameraPositionSynchronizer(coronalCameraSynchronizerId);
        ctVoiSynchronizer = createVOISynchronizer(ctVoiSynchronizerId, {
          syncInvertState: false,
          syncColormap: false,
        });
        ptVoiSynchronizer = createVOISynchronizer(ptVoiSynchronizerId, {
          syncInvertState: false,
          syncColormap: false,
        });
        fusionVoiSynchronizer = createVOISynchronizer(fusionVoiSynchronizerId, {
          syncInvertState: false,
          syncColormap: false,
        });
        
        [viewportIds.CT.AXIAL].forEach((viewportId) => {
          axialCameraPositionSynchronizer.add({ renderingEngineId, viewportId });
        });
        [viewportIds.CT.SAGITTAL].forEach((viewportId) => {
          sagittalCameraPositionSynchronizer.add({ renderingEngineId, viewportId });
        });
        [viewportIds.CT.CORONAL].forEach((viewportId) => {
          coronalCameraPositionSynchronizer.add({ renderingEngineId, viewportId });
        });
        
        [viewportIds.CT.AXIAL, viewportIds.CT.SAGITTAL, viewportIds.CT.CORONAL].forEach((viewportId) => {
          ctVoiSynchronizer.add({ renderingEngineId, viewportId });
        });
      }
      
      function getPtImageIds() {
        return createImageIdsAndCacheMetaData({
          StudyInstanceUID,
          SeriesInstanceUID: "1.2.250.1.90.3.4205557061.20250224172827.3476.14",
          wadoRsRoot,
        });
      }
      
      function getCtImageIds() {
        return createImageIdsAndCacheMetaData({
          StudyInstanceUID,
          SeriesInstanceUID: "1.2.250.1.90.3.4205557061.20250224172827.3476.14",
          wadoRsRoot,
        });
      }
      
      async function setUpDisplay() {
        const viewportInputArray = [
          {
            viewportId: viewportIds.CT.AXIAL,
            type: ViewportType.ORTHOGRAPHIC,
            element: element1_1,
            defaultOptions: { orientation: Enums.OrientationAxis.AXIAL },
          },
          {
            viewportId: viewportIds.CT.SAGITTAL,
            type: ViewportType.ORTHOGRAPHIC,
            element: element1_2,
            defaultOptions: { orientation: Enums.OrientationAxis.SAGITTAL },
          },
          {
            viewportId: viewportIds.CT.CORONAL,
            type: ViewportType.ORTHOGRAPHIC,
            element: element1_3,
            defaultOptions: { orientation: Enums.OrientationAxis.CORONAL },
          },
        ];
        
        renderingEngine.setViewports(viewportInputArray);
        
        await ctVolume.load();
        await ptVolume.load();
        
        await setVolumesForViewports(
          renderingEngine,
          [
            {
              volumeId: ctVolumeId,
              callback: setCtTransferFunctionForVolumeActor,
            },
          ],
          [viewportIds.CT.AXIAL, viewportIds.CT.SAGITTAL, viewportIds.CT.CORONAL]
        );
        
        const ptVolumeDimensions = ptVolume.dimensions;
        const slabThickness = Math.sqrt(
          ptVolumeDimensions[0] * ptVolumeDimensions[0] +
          ptVolumeDimensions[1] * ptVolumeDimensions[1] +
          ptVolumeDimensions[2] * ptVolumeDimensions[2]
        );
        
        initializeCameraSync(renderingEngine);
        renderingEngine.render();
      }
      
      function initializeCameraSync(renderingEngine) {
        const axialCtViewport = renderingEngine.getViewport(viewportIds.CT.AXIAL);
        const sagittalCtViewport = renderingEngine.getViewport(viewportIds.CT.SAGITTAL);
        const coronalCtViewport = renderingEngine.getViewport(viewportIds.CT.CORONAL);
        renderingEngine.render();
      }
      
      async function run() {
        await initDemo();
        renderingEngine = new RenderingEngine(renderingEngineId);
        ctImageIds = await getCtImageIds();
        ptImageIds = await getPtImageIds();
        ctVolume = await volumeLoader.createAndCacheVolume(ctVolumeId, { imageIds: ctImageIds });
        ptVolume = await volumeLoader.createAndCacheVolume(ptVolumeId, { imageIds: ptImageIds });
        await setUpDisplay();
        setUpToolGroups();
        setUpSynchronizers();
      }
      
      await run();
    };
    
    initialize();
    
    return () => {
      // Cleanup on unmount
      const content = document.getElementById("content");
      if (content) content.innerHTML = "";
      // Destroy tool groups
      [ctToolGroupId, ptToolGroupId, fusionToolGroupId, mipToolGroupUID].forEach((toolGroupId) => {
        if (ToolGroupManager) {
          ToolGroupManager.destroyToolGroup(toolGroupId);
        }
      });
      // Optionally reset rendering engine
      const renderingEngine = getRenderingEngine?.(renderingEngineId);
      if (renderingEngine) {
        renderingEngine.destroy();
      }
    };
  }, []);
  
  return (
    <section>
      <div id="demo-title"></div>
      <div id="demo-description"></div>
      <div id="content" ref={contentRef}></div>
    </section>
  );
}
