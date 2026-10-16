"use client";

import clsx from "clsx";
import { formatBRL, parseToNumberFromMaskedBRL } from "@/helpers/currency";
import { inputClass } from "@/components/ui/Field";

/** Campo em R$ com máscara: o usuário digita só números, como em apps de banco. */
export default function MoneyInput({
  value,
  onChange,
  className,
  ...rest
}: Readonly<
  {
    value: number | null;
    onChange: (value: number | null) => void;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">
>) {
  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder="R$ 0,00"
      value={value ? formatBRL(value) : ""}
      onChange={(e) => {
        const n = parseToNumberFromMaskedBRL(e.target.value);
        onChange(n > 0 ? n : null);
      }}
      className={clsx(inputClass, "tabular", className)}
      {...rest}
    />
  );
}
