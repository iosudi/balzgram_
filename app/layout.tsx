import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getCurrentUser, getToken } from "@/lib/auth";
import { AuthProvider } from "@/Contexts/AuthContext";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Balzgram",
  description: "Balzgram is a chat application for the Balz family.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const token = await getToken();

  return (
    <html lang="en">
      <body className={`${interSans.variable} font-sans antialiased`}>
        <AuthProvider token={token} initUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
