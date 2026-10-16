"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import clsx from "clsx";

/** Faz o conteúdo surgir (fade + subida) quando entra na tela. */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
  ...rest
}: Readonly<
  {
    as?: ElementType;
    delay?: number;
    className?: string;
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      className={clsx("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
