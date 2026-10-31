import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Wildwood Academy · Full-Stack AI Learning Management System',
  description: 'An enchanted woodland learning management system powered by AI, source-grounded tutoring, and personal study archives.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-forest-900 text-parchment antialiased min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
