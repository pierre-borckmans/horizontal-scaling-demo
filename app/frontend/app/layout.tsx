import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horizontal Scaling Demo",
  description: "International train journeys to your doorstep",
  icons: ["/rails.svg"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
