import React from "react";
import clsx from "clsx";

export function Grid() {
  const headers = ["Search Price", "Google", "Chat GPT", "Avantpro"];

  const features = Array.from({ length: 5 }, (_, row) =>
    ["✅", "❌", "❌", "❌"].map((symbol, col) => {
      const cellClasses = clsx(
        "flex items-center justify-center rounded-md text-base border-2",
        {
          "bg-[var(--light-black-to-gray)] text-white border-[var(--secondary-to-gray)]":
            symbol === "✅",
          "bg-[var(--black-to-light-gray)] border-white": symbol !== "✅",
        }
      );

      return (
        <div key={`feature-${row}-${col}`} className={cellClasses}>
          {symbol}
        </div>
      );
    })
  ).flat();

  return (
    <div className="grid grid-rows-6 grid-cols-4 gap-4 mt-12 h-[22rem]">
      {/* Cabeçalho */}
      {headers.map((label, idx) => {
        const isFirst = idx === 0;
        const headerClasses = clsx(
          "flex items-center justify-center p-2 rounded-md border-2",
          {
            "bg-[var(--black-to-primary)] text-sm text-center text-white border-[var(--secondary-to-primary)]":
              isFirst,
            "bg-[var(--black-to-light-blue)] text-sm text-center text-[var(--white-to-primary)] border-white":
              !isFirst,
          }
        );

        return (
          <div key={label} className={headerClasses}>
            {label}
          </div>
        );
      })}

      {/* Linhas de checks/crosses */}
      {features}
    </div>
  );
}
