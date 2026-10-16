"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: React.ReactNode;
}

export const inputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-fg placeholder:text-subtle outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-ring/30 disabled:opacity-60";

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, className, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-fg">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={clsx(inputClass, error && "border-danger", className)}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
      {hint}
    </div>
  );
});

export function PasswordField(props: Omit<FieldProps, "type">) {
  const [show, setShow] = useState(false);
  const autoId = useId();
  const inputId = props.id ?? autoId;
  const { label, error, hint, className, ...rest } = props;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-fg">
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={inputId}
          type={show ? "text" : "password"}
          aria-invalid={!!error}
          className={clsx(inputClass, "pr-11", error && "border-danger", className)}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Esconder senha" : "Mostrar senha"}
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-subtle hover:text-fg"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint}
    </div>
  );
}

export function PasswordRules({
  rules,
  password,
}: Readonly<{ rules: { text: string; regex: RegExp }[]; password: string }>) {
  return (
    <ul className="grid grid-cols-1 gap-1 pt-1 text-xs sm:grid-cols-2">
      {rules.map((r) => {
        const ok = r.regex.test(password);
        return (
          <li
            key={r.text}
            className={clsx("flex items-center gap-1.5", ok ? "text-success" : "text-muted")}
          >
            <span
              className={clsx(
                "size-1.5 rounded-full",
                ok ? "bg-success" : "bg-border-strong"
              )}
            />
            {r.text}
          </li>
        );
      })}
    </ul>
  );
}

export function FormError({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
      {children}
    </p>
  );
}
