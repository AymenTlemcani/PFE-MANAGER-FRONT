import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isScrollingDown = useScrollDirection();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        className={`fixed top-0 right-0 lg:left-64 left-0 z-10 transition-transform duration-300 ease-in-out ${
          isScrollingDown ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-2 rounded-md lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <Header />
          </div>
        </div>
      </div>

      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 lg:p-8 mt-16 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
