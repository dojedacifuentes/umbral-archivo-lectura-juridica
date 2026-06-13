import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ProgressProvider } from "@/components/providers/progress-provider";
import { CyberpunkLayout } from "@/components/layout/cyberpunk-layout";

export const metadata: Metadata = {
  title: "UMBRAL | Archivo de Lectura Jurídica",
  description: "RPG cyberpunk de comprensión lectora jurídica, argumentación e inferencia.",
};

export const viewport: Viewport = { themeColor: "#070711", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <ProgressProvider>
          <CyberpunkLayout>{children}</CyberpunkLayout>
        </ProgressProvider>
      </body>
    </html>
  );
}
