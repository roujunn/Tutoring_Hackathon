import React, { useEffect, useRef, useState } from "react";

export default function Whiteboard() {
  const canvasRef = React.useRef(null);
  const [drawing, setDrawing] = React.useState(false);
  const [color, setColor] = React.useState("#111827");
  const [size, setSize] = React.useState(3);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    let rect = canvas.getBoundingClientRect();

    const rel = (e) => ({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const onDown = (e) => {
      setDrawing(true);
      const p = rel(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    };
    const onMove = (e) => {
      if (!drawing) return;
      const p = rel(e);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };
    const onUp = () => setDrawing(false);

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    const onResize = () => {
      rect = canvas.getBoundingClientRect();
    };
    window.addEventListener("resize", onResize);
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [drawing, color, size]);

  const clear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };
  const download = () => {
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "whiteboard.png";
    a.click();
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input
          aria-label="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          aria-label="size"
          type="range"
          min={1}
          max={15}
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
        />
        <button className="px-3 py-1 rounded-lg border" onClick={clear}>
          Clear
        </button>
        <button className="px-3 py-1 rounded-lg border" onClick={download}>
          Download
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={360}
        className="w-full border rounded-xl bg-white"
      />
    </div>
  );
}
