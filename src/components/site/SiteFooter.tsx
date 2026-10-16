import Link from "next/link";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";

const COLUMNS = [
  {
    title: "Produto",
    links: [
      { label: "Como funciona", href: "/#como-funciona" },
      { label: "Canais", href: "/#canais" },
      { label: "Perguntas frequentes", href: "/#faq" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "/about" },
      { label: "Diferenciais", href: "/our-advantages" },
      { label: "Depoimentos", href: "/testimonials" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Entrar", href: "/login" },
      { label: "Criar conta", href: "/register" },
    ],
  },
];

export const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/searchprice", Icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/searchprice", Icon: Linkedin },
  { name: "WhatsApp", href: "https://whatsapp.com/searchprice", Icon: MessageCircle },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted">
            Inteligência de preços para quem vende no Mercado Livre, Amazon e
            Shopee.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="grid size-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-brand hover:text-brand"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold text-fg">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-subtle sm:px-6">
          © 2023–{new Date().getFullYear()} Search Price Soluções Tecnológicas
          LTDA. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
