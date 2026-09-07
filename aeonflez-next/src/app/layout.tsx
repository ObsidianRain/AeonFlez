import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeonFlez",
  description: "AeonFlez - Next.js Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
