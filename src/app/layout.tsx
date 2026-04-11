import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GeneSys | Self-Healing Cyber-Resilient System',
  description: 'A biological-inspired cyber defense system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#0F0B0A] text-white selection:bg-[#BFA181]/30">
        {children}
      </body>
    </html>
  );
}