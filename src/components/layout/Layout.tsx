import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { useScrollDirection } from "../../hooks/useScrollDirection";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrollingDown = useScrollDirection();
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-30 transition-transform duration-200 ${
          !isScrollingDown || isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <Header onMenuChange={setIsMenuOpen} />
        </div>
      </div>

      <div className="flex pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 lg:p-8 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
