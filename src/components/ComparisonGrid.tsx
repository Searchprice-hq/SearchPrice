import React from "react";

export function ComparisonGrid() {
  const rows = Array.from({ length: 5 }, (_, row) => (
    <React.Fragment key={row}>
      {["✅", "❌", "❌", "❌"].map((symbol, col) => {
        const cellClasses =
          symbol === "✅"
            ? "bg-[var(--background-secundary-color)] text-white shadow-[0_0_1px_var(--third-color)_0_0_2px_var(--third-color)_0_0_3px_var(--third-color)]"
            : "bg-[var(--background-secundary-color)] shadow-[0_0_1px_var(--white)_0_0_2px_var(--white)_0_0_3px_var(--white)]";
        return (
          <div
            key={`cell-${row}-${col}`}
            className={`flex items-center justify-center rounded-md text-base ${cellClasses}`}
          >
            {symbol}
          </div>
        );
      })}
    </React.Fragment>
  ));

  return <>{rows}</>;
}
