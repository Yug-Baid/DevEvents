import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The hub for all event realted to Devs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased`}
      >
        <Navbar/>
        <div className="absolute z-[-1] inset-0 top-0 min-h-screen ">
  <LightRays
    raysOrigin="top-center-offset"
    raysColor="#5dfeca"
    raysSpeed={0.9}
    lightSpread={1.5}
    rayLength={1.2}
    followMouse={true}
    mouseInfluence={0.02}
    noiseAmount={0.0}
    distortion={0.01}
    className="custom-rays"
  />
</div>
        {children}
      </body>
    </html>
  );
}
