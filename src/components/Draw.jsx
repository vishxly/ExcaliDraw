import React, { useState, useRef } from "react";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import { FaUndoAlt, FaTrash } from "react-icons/fa";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "../constants";

const Draw = () => {
  const stageRef = useRef();
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState("solid");
  const [opacity, setOpacity] = useState(1);
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isPaining = useRef();
  const currentShapeId = useRef();
  const transformerRef = useRef();
  const isDraggable = action === ACTIONS.SELECT;
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  function onPointerDown() {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();

    currentShapeId.current = id;
    isPaining.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) => [
          ...rectangles,
          {
            type: "RECTANGLE",
            id,
            x,
            y,
            height: 20,
            width: 20,
            strokeColor,
            strokeWidth,
            strokeStyle,
            opacity,
          },
        ]);
        addToHistory([...rectangles, ...circles, ...arrows, ...scribbles]);
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) => [
          ...circles,
          {
            type: "CIRCLE",
            id,
            x,
            y,
            radius: 20,
            strokeColor,
            strokeWidth,
            strokeStyle,
            opacity,
          },
        ]);
        addToHistory([...rectangles, ...circles, ...arrows, ...scribbles]);
        break;

      case ACTIONS.ARROW:
        setArrows((arrows) => [
          ...arrows,
          {
            type: "ARROW",
            id,
            points: [x, y, x + 20, y + 20],
            strokeColor,
            strokeWidth,
            strokeStyle,
            opacity,
          },
        ]);
        addToHistory([...rectangles, ...circles, ...arrows, ...scribbles]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) => [
          ...scribbles,
          {
            type: "SCRIBBLE",
            id,
            points: [x, y],
            strokeColor,
            strokeWidth,
            strokeStyle,
            opacity,
          },
        ]);
        addToHistory([...rectangles, ...circles, ...arrows, ...scribbles]);
        break;
    }
  }

  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPaining.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
              };
            }
            return rectangle;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
        break;
    }
  }

  function onPointerUp() {
    isPaining.current = false;
  }

  function handleExport() {
    const uri = stageRef.current.toDataURL();
    var link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function onClick(e) {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  }

  const handleSidebarClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addToHistory = (newShapes) => {
    setHistory((prev) => [...prev, newShapes]);
    setRedoHistory([]);
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      const lastShapes = newHistory.pop();
      const undoShape = newHistory[newHistory.length - 1];
      setRectangles(undoShape.filter((shape) => shape.type === "RECTANGLE"));
      setCircles(undoShape.filter((shape) => shape.type === "CIRCLE"));
      setArrows(undoShape.filter((shape) => shape.type === "ARROW"));
      setScribbles(undoShape.filter((shape) => shape.type === "SCRIBBLE"));
      setHistory(newHistory);
      setRedoHistory((prev) => [...prev, lastShapes]);
    }
  };

  // const redo = () => {
  //   if (redoHistory.length > 0) {
  //     const newShapes = redoHistory.pop();
  //     setRectangles(newShapes.filter((shape) => shape.type === "RECTANGLE"));
  //     setCircles(newShapes.filter((shape) => shape.type === "CIRCLE"));
  //     setArrows(newShapes.filter((shape) => shape.type === "ARROW"));
  //     setScribbles(newShapes.filter((shape) => shape.type === "SCRIBBLE"));
  //     setHistory((prev) => [...prev, newShapes]);
  //   }
  // };

  const deleteShape = () => {
    const selectedNode = transformerRef.current.nodes()[0];
    if (selectedNode) {
      const id = selectedNode.attrs.id;
      setRectangles((rectangles) =>
        rectangles.filter((rectangle) => rectangle.id !== id)
      );
      setCircles((circles) => circles.filter((circle) => circle.id !== id));
      setArrows((arrows) => arrows.filter((arrow) => arrow.id !== id));
      setScribbles((scribbles) =>
        scribbles.filter((scribble) => scribble.id !== id)
      );
      transformerRef.current.nodes([]);
      addToHistory([...rectangles, ...circles, ...arrows, ...scribbles]);
    }
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Sidebar */}
        {/* <div
          className={`absolute top-0 left-0 z-10 h-full py-2 ${
            sidebarOpen ? "w-16" : "w-12"
          } transition-all duration-300 ease-in-out bg-gray-200`}
        >
          <div
            className={`flex flex-col justify-start items-center gap-3 py-2 px-3 mx-auto border shadow-lg rounded-lg cursor-pointer ${
              sidebarOpen ? "w-16" : "w-12"
            }`}
          >
            <div
              className="mt-4 hover:bg-violet-100 cursor-pointer"
              onClick={handleSidebarClick}
              onDoubleClick={() => setSidebarOpen(false)}
            >
              <BsLayoutTextSidebar size={30} />
            </div>
            {sidebarOpen && (
              <>
                <div
                  className="mt-4  cursor-pointer hover:bg-violet-100"
                  onClick={() =>
                    setAction(action === ACTIONS.SELECT ? null : ACTIONS.SELECT)
                  }
                  onDoubleClick={() => setAction(null)}
                >
                  Sign Up
                </div>
                <div
                  className="mt-4  cursor-pointer hover:bg-violet-100"
                  onClick={() => console.log("Theme")}
                  onDoubleClick={() => console.log("Theme")}
                >
                  Theme
                </div>
              </>
            )}
          </div>
        </div> */}
        <div>
          <img src="../assets/logo" alt="logo" />
        </div>
          
        
        {/* Controls */}
        <div
          className={`absolute top-0 right-0 z-10 w-full py-2 ${
            sidebarOpen ? "ml-16" : "ml-12"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg bg-gray-200">
            <button
              className={`${
                action === ACTIONS.SELECT ? "bg-violet-300" : ""
              } p-1 rounded hover:bg-violet-100`}
              onClick={() => setAction(ACTIONS.SELECT)}
            >
              <GiArrowCursor size={30} />
            </button>
            <button
              className={`${
                action === ACTIONS.RECTANGLE ? "bg-violet-300" : ""
              } p-1 rounded hover:bg-violet-100`}
              onClick={() => setAction(ACTIONS.RECTANGLE)}
            >
              <TbRectangle size={30} />
            </button>
            <button
              className={`${
                action === ACTIONS.CIRCLE ? "bg-violet-300" : ""
              } p-1 rounded hover:bg-violet-100`}
              onClick={() => setAction(ACTIONS.CIRCLE)}
            >
              <FaRegCircle size={30} />
            </button>
            <button
              className={`${
                action === ACTIONS.ARROW ? "bg-violet-300" : ""
              } p-1 rounded hover:bg-violet-100`}
              onClick={() => setAction(ACTIONS.ARROW)}
            >
              <FaLongArrowAltRight size={30} />
            </button>
            <button
              className={`${
                action === ACTIONS.SCRIBBLE ? "bg-violet-300" : ""
              } p-1 rounded hover:bg-violet-100`}
              onClick={() => setAction(ACTIONS.SCRIBBLE)}
            >
              <LuPencil size={30} />
            </button>

            <input
              className="w-12 h-6"
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
            />

            <input
              className="w-12 h-6"
              type="number"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            />

            <select
              className="w-16 h-6"
              value={strokeStyle}
              onChange={(e) => setStrokeStyle(e.target.value)}
            >
              <option value="solid">Solid</option>
              <option value="dotted">Dotted</option>
            </select>

            <input
              className="w-16 h-6"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
            />

            <button onClick={handleExport}>
              <IoMdDownload size={30} />
            </button>
            <button className="hover:bg-violet-100 rounded" onClick={undo}>
              <FaUndoAlt size={30} />
            </button>

            <button
              className="hover:bg-violet-100 rounded"
              onClick={deleteShape}
            >
              <FaTrash size={30} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              height={window.innerHeight}
              width={window.innerWidth}
              fill="#ffffff"
              id="bg"
              onClick={() => {
                transformerRef.current.nodes([]);
              }}
            />

            {rectangles.map((rectangle) => (
              <Rect
                key={rectangle.id}
                id={rectangle.id}
                x={rectangle.x}
                y={rectangle.y}
                stroke={rectangle.strokeColor}
                strokeWidth={rectangle.strokeWidth}
                fill={rectangle.fillColor}
                height={rectangle.height}
                width={rectangle.width}
                draggable={isDraggable}
                onClick={onClick}
                opacity={rectangle.opacity}
                strokeScaleEnabled={false}
                dashEnabled={rectangle.strokeStyle !== "solid"}
                dash={[10, 5]}
              />
            ))}

            {circles.map((circle) => (
              <Circle
                key={circle.id}
                id={circle.id}
                radius={circle.radius}
                x={circle.x}
                y={circle.y}
                stroke={circle.strokeColor}
                strokeWidth={circle.strokeWidth}
                fill={circle.fillColor}
                draggable={isDraggable}
                onClick={onClick}
                opacity={circle.opacity}
                strokeScaleEnabled={false}
                dashEnabled={circle.strokeStyle !== "solid"}
                dash={[10, 5]}
              />
            ))}
            {arrows.map((arrow) => (
              <Arrow
                key={arrow.id}
                id={arrow.id}
                points={arrow.points}
                stroke={arrow.strokeColor}
                strokeWidth={arrow.strokeWidth}
                fill={arrow.fillColor}
                draggable={isDraggable}
                onClick={onClick}
                opacity={arrow.opacity}
                strokeScaleEnabled={false}
                dashEnabled={arrow.strokeStyle !== "solid"}
                dash={[10, 5]}
              />
            ))}

            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                id={scribble.id}
                lineCap="round"
                lineJoin="round"
                points={scribble.points}
                stroke={scribble.strokeColor}
                strokeWidth={scribble.strokeWidth}
                fill={scribble.fillColor}
                draggable={isDraggable}
                onClick={onClick}
                opacity={scribble.opacity}
                strokeScaleEnabled={false}
                dashEnabled={scribble.strokeStyle !== "solid"}
                dash={[10, 5]}
              />
            ))}

            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default Draw;
