import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Beauty Bliss by Sruthi",
  description:
    "Boutique esthetics studio in Edmonton. Advanced facials, microneedling, and bespoke skin treatments tailored to you by Sruthi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
