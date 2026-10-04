import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PlanProvider } from '@/components/PlanProvider';

export const metadata = { title: 'FitLog — Workout Library', description: 'A dark, no-nonsense workout library and daily training log.' };

export default function RootLayout({ children }) {
  return <html lang="en"><body><PlanProvider><Navbar /><main>{children}</main><Footer /><Toaster position="top-right" toastOptions={{duration:2200}} /></PlanProvider></body></html>;
}
