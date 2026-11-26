import { Suspense } from "react";
import Intelligence from "./Intelligence";

export const metadata = {
  title: "Inteligência de Preços",
  description: "Visão de mercado, análise de ofertas e simulador de rentabilidade multicanal.",
};

export default function IntelligencePage() {
  return (
    <Suspense>
      <Intelligence />
    </Suspense>
  );
}
