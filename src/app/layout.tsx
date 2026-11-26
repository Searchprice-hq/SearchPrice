import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "../../globals.css";

// Fonte servida pelo próprio projeto: o next/font/google do Next 15.3
// quebra no build quando o Google devolve URLs sem extensão.
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Search Price — seu preço comparado ao mercado",
    template: "%s · Search Price",
  },
  description:
    "Compare o preço do seu produto com Mercado Livre, Amazon e Shopee e descubra se você está acima ou abaixo do mercado.",
  icons: {
    icon: [{ url: "/favicon-48.png", sizes: "48x48", type: "image/png" }],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Search Price",
    description:
      "Seu preço está acima ou abaixo do mercado? Compare Mercado Livre, Amazon e Shopee em um só lugar.",
    images: ["/brand/og.png"],
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
