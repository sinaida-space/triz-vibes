import type { Metadata } from "next";
import "./globals.css";
import { GlitchLayer } from "@/components/animation/GlitchLayer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Противоречие — ТРИЗ-инструмент для цифровых художников и AI-криэйторов",
  description:
    "Интерактивный русскоязычный web app, который помогает разобрать творческий блок, найти противоречие, подобрать ТРИЗ-приём, сформулировать ИКР и собрать карту проекта.",
  authors: [{ name: "sin.ai.da", url: "https://sinaida.eu" }],
  openGraph: {
    title: "Противоречие",
    description: "ТРИЗ-инструмент для цифровых художников и AI-криэйторов.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <GlitchLayer />
        <Header />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
