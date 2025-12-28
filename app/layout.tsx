export const dynamic = 'force-dynamic';
// app/layout.tsx - Root Layout with ToastProvider
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";

export const metadata = {
  title: "Banadama Platform",
  description: "Cross-border B2C, B2B, Creators & Logistics Platform.",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100" suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
