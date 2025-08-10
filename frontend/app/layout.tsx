import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BookProvider } from '@/contexts/BookContext';
import { UIProvider } from '@/contexts/UIContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Library Manager - Manage Your Book Collection',
  description: 'A comprehensive CRUD application for managing your personal library book collection. Add, edit, view, and delete books with ease.',
  keywords: 'library, books, collection, management, CRUD, React, Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BookProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </BookProvider>
      </body>
    </html>
  );
}