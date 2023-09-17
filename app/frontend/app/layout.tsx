import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "../styles/globals.css";
import "../styles/app.css";

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
        <main
          className="app flex h-fit min-h-screen w-full min-w-0 flex-col items-center overflow-hidden px-2 pt-8"
          style={{}}
        >
          {" "}
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
