import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App - iPhone Style',
  description: 'A beautiful, modern todo app with iPhone design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Ensure viewport uses the full-bleed area on iOS (notch support) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Make web app capable when added to home screen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* Let the status bar be dark/translucent so app background shows through */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Theme color for browsers (controls the top bar background on Android and some iOS behavior) */}
        <meta name="theme-color" content="#1A1A1A" />
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
