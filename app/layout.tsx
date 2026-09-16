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
  keywords: ["luxury fashion", "minimalist clothing", "designer", "Florence atelier", "silk coats"],
  authors: [{ name: "Maison RK Team" }],
  openGraph: {
    title: "Maison RK | Premium Minimalist Luxury E-Commerce",
    description: "Experience minimalist luxury fashion with Maison RK.",
    type: "website",
    locale: "en_US",
    siteName: "Maison RK",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maison RK Premium Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison RK | Luxury Fashion",
    description: "Minimalist luxury essentials designed for fluidity and engineered for comfort.",
    images: ["/og-image.jpg"],
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
