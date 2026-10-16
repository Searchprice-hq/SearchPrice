import { Check } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const BULLETS = [
  "Compare Mercado Livre, Amazon e Shopee em um só painel",
  "Saiba se seu preço está acima ou abaixo da mediana",
  "Calcule a margem antes de mudar o preço",
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: Readonly<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-strong via-brand to-accent p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-1/3 size-96 rounded-full bg-white/20 blur-3xl animate-blob" aria-hidden />
        <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-white/10 blur-3xl animate-blob [animation-delay:-8s]" aria-hidden />
        <Logo inverted className="relative" />
        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold tracking-tight text-white text-balance">
            Precifique com o mercado na tela, não no achismo.
          </h2>
          <ul className="mt-8 space-y-4">
            {BULLETS.map((b) => (
              <li key={b} className="flex gap-3 text-white/90">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white text-brand">
                  <Check className="size-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/70">
          © {new Date().getFullYear()} Search Price Soluções Tecnológicas LTDA.
        </p>
      </aside>

      <main className="flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
            {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
