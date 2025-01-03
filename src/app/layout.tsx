import Providers from "@/components/Providers";
import ClientHeader from "@/components/ClientHeader";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth/next";
import { authOptions } from './api/auth/[...nextauth]/auth-options';
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from '@/components/QueryProvider'

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <Providers session={session}>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <ClientHeader />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </Providers>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}