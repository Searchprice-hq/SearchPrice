import type { Metadata } from "next";
import "../../globals.css";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Search Price",
  description: "Aplicativo de comparação de preços",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
