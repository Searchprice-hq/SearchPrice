"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface LegendTooltipProps {
  drop?: boolean;
}

export default function LegendTooltip({ drop = false }: LegendTooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const mobileTopClass = drop ? "top-88" : "top-68";

  return (
    <div className="relative flex items-center" ref={tooltipRef}>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow"
      >
        <Image src="/info.png" alt="Legenda" width={20} height={20} />
      </button>

      {visible && (
        <div
          className={`
            fixed inset-x-0 left-1/2 -translate-x-1/2 ${mobileTopClass}
            w-[280px]
            sm:absolute sm:top-14 sm:left-1/2 sm:-translate-x-1/2
            z-50 bg-black text-white p-4 rounded-lg shadow-lg text-sm
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-green-500 rounded" />
            <span>Lucro e preço de venda competitivo</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-yellow-500 rounded" />
            <span>Lucro e preço de venda igual ao do anúncio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded" />
            <span>Sem lucro ou preço de venda maior que do anúncio</span>
          </div>
        </div>
      )}
    </div>
  );
}
