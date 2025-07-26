"use client";
import { useState } from "react";

interface TooltipInfoProps {
  text: string;
}

export default function TooltipInfo({ text }: TooltipInfoProps) {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <div
      className="relative ml-2 inline-block select-none"
      onMouseDown={show}
      onMouseUp={hide}
      onMouseLeave={hide}
      onTouchStart={show}
      onTouchEnd={hide}
      onTouchCancel={hide}
    >
      <div className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold cursor-default">
        i
      </div>
      {visible && (
        <div className="absolute z-50 w-52 p-2 bg-black text-white text-sm rounded-md bottom-6 left-1/2 -translate-x-1/2 shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}
