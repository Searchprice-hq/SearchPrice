import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface LogoProps {
  href?: string;
  className?: string;
  /** Força a versão branca do símbolo (ex.: sobre fundo escuro fixo). */
  inverted?: boolean;
  showText?: boolean;
}

export default function Logo({
  href = "/",
  className,
  inverted = false,
  showText = true,
}: Readonly<LogoProps>) {
  return (
    <Link
      href={href}
      className={clsx("inline-flex items-center gap-2.5 shrink-0", className)}
      aria-label="Search Price — início"
    >
      <Image
        src={inverted ? "/brand/mark-white.png" : "/brand/mark.png"}
        alt=""
        width={36}
        height={36}
        priority
        className="size-9"
      />
      {showText && (
        <span
          className={clsx(
            "text-[15px] font-semibold tracking-[0.18em] uppercase",
            inverted ? "text-white" : "text-fg"
          )}
        >
          Search
          <span
            className={clsx(
              "ml-1.5 rounded-md px-1.5 py-0.5 font-bold",
              inverted
                ? "bg-white/15 text-white"
                : "bg-brand text-brand-contrast"
            )}
          >
            Price
          </span>
        </span>
      )}
    </Link>
  );
}
