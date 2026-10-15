import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileActionBar } from "@/components/MobileActionBar";
import { ScrollProgress } from "@/components/Motion";
import { Providers } from "@/components/Providers";
import { ShoppingListDrawer } from "@/components/ShoppingListDrawer";
import { Splash, splashBootScript } from "@/components/Splash";
import { site } from "@/data/site";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ali Marketi - Vaša dnevna rutina",
    template: "%s - Ali Marketi",
  },
  description:
    "12 marketa u Sarajevu i Cash & Carry u Halilovićima. Akcije, mjesečni katalog i najbliža poslovnica.",
  applicationName: "Ali Marketi",
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon/favicon.ico",
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "bs_BA",
    siteName: "Ali Marketi",
  },
  twitter: { card: "summary_large_image" },
};

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: `${site.url}/logo-ali.svg`,
      foundingDate: String(site.founded),
      email: site.email,
      telephone: site.phoneTel,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Halilovići bb",
        addressLocality: "Sarajevo",
        postalCode: "71000",
        addressCountry: "BA",
      },
      sameAs: [site.facebook, site.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "bs",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bs" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashBootScript }} />
      </head>
      <body className="min-h-full bg-paper text-ink">
        <a className="skip-link" href="#sadrzaj">
          Preskoči na sadržaj
        </a>
        <Providers>
          <Splash />
          <ScrollProgress />
          <div className="flex min-h-full flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
            <Header />
            <main id="sadrzaj" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ShoppingListDrawer />
          <MobileActionBar />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
      </body>
    </html>
  );
}
