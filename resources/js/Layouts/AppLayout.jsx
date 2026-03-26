import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Navbar - Sticky */}
        <div className="sticky top-0 z-20">
          <Navbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            user={auth}
          />
        </div>

        {/* Page Content */}
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

        {/* Footer */}
        <footer className="w-full mt-auto">
          <Footer />
        </footer>
      </div>
    </div>
  );
}