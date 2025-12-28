import { Inter } from 'next/font/google';
import AuthProvider from '@/components/providers/AuthProvider';
import MuiThemeProvider from '@/components/providers/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EduAdmin - Dashboard',
  description: 'Modern admin dashboard for managing users and products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MuiThemeProvider>
            {children}
          </MuiThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
