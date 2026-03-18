import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Menu, X, Bell, LogOut, Settings, User, Home, BookOpen, 
  Trophy, Zap, Users, BarChart3 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { props } = usePage();
  const auth = props.auth?.user;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Static on desktop, Fixed on mobile */}
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar open={true} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Navbar - Sticky */}
        <div className="sticky top-0 z-20 bg-white dark:bg-slate-900">
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            user={auth}
          />
        </div>

        {/* Page Content - Scrollable */}
        <main className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>

        {/* Footer - Relative at bottom */}
        <footer className="w-full mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
