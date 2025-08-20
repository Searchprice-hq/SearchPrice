"use client";
import { useState, useEffect, useRef, useId } from "react";

interface TooltipInfoProps {
  text: string;
}

export default function TooltipInfo({ text }: Readonly<TooltipInfoProps>) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

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

  useEffect(() => {
    if (!visible) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [visible]);

  const toggle = () => {
    setVisible((v) => !v);
  };

  return (
    <button
      ref={wrapperRef}
      type="button"
      onClick={toggle}
      aria-expanded={visible}
      aria-controls={tooltipId}
      aria-describedby={visible ? tooltipId : undefined}
      aria-label="Mais informações"
      className="relative ml-2 inline-block select-none"
    >
      <span className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold">
        i
      </span>

      {visible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 w-52 p-2 bg-black text-white text-sm rounded-md bottom-6 left-1/2 -translate-x-1/2 shadow-lg"
        >
          {text}
        </div>
      )}
    </button>
  );
}
