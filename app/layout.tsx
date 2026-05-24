import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { ToastProvider } from "@/hooks/useToast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maison RK | Premium Minimalist Luxury E-Commerce",
  description: "Experience minimalist luxury fashion with Maison RK. Explore double-breasted silk trench coats, hand-crafted calfskin leather bags, and premium everyday essentials.",
  metadataBase: new URL("https://maisonrk.com"),
  openGraph: {
    title: "Maison RK | Premium Minimalist Luxury E-Commerce",
    description: "Experience minimalist luxury fashion with Maison RK.",
    type: "website",
    locale: "en_US",
    siteName: "Maison RK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
