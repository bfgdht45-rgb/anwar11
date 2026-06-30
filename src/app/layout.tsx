import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أكاديمية الرياضيات | منصة تعليمية احترافية للمرحلتين الإعدادية والثانوية",
  description: "منصة تعليمية متكاملة لمادة الرياضيات للمرحلتين الإعدادية والثانوية. فيديوهات، ملفات PDF، واجبات، امتحانات تفاعلية، متابعة الدرجات، وشهادات إتمام.",
  keywords: ["رياضيات", "تعليم", "إعدادي", "ثانوي", "منصة تعليمية", "امتحانات", "واجبات"],
  authors: [{ name: "Math Academy" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${tajawal.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
