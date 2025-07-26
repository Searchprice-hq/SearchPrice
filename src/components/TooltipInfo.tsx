"use client";
import { useState, useEffect, useRef } from "react";

interface TooltipInfoProps {
  text: string;
}

export default function TooltipInfo({ text }: TooltipInfoProps) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible((v) => !v);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative ml-2 inline-block select-none"
      onClick={toggle} // só um handler
    >
      <div className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold cursor-pointer">
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
