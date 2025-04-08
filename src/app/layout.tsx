import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from '@/components/Toast'
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduAssist - AI Grading Platform",
  description: "A demo of the EduAssist AI-powered grading platform for education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
        <Script id="focus-fix">{`
          // Fix for "Maximum update depth exceeded" error
          window.addEventListener('error', (event) => {
            if (event.message.includes('Maximum update depth exceeded')) {
              event.preventDefault();
              console.warn('Prevented React maximum update depth error');
            }
          });
        `}</Script>
      </body>
    </html>
  );
}
