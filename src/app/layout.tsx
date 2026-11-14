import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5B0E2D",
};

export const metadata: Metadata = {
  title: "जैन सराफा थैला | प्रीमियम आभूषण एवं पैकेजिंग बैग निर्माता - आगरा",
  description:
    "जैन सराफा थैला (आगरा, उत्तर प्रदेश) - मखमली पोटली, जरी डोरी आभूषण बैग, पर्यावरण-अनुकूल सूती थैला एवं कस्टम स्क्रीन/गोल्ड फॉयल प्रिंटिंग के प्रमुख निर्माता। खुदरा एवं थोक आपूर्ति।",
  keywords: [
    "Jain Sarafa Thella",
    "Sarafa bag manufacturer Agra",
    "Jewellery pouches Agra",
    "Velvet potli wholesale",
    "Cotton thella manufacturer",
    "Custom gold foil bag printing",
    "जैन सराफा थैला",
    "आभूषण थैला आगरा",
  ],
  authors: [{ name: "Jain Sarafa Thella" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Rozha+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-sarafa-cream text-sarafa-charcoal selection:bg-sarafa-gold selection:text-sarafa-maroon-dark">
        {children}
      </body>
    </html>
  );
}
