import { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { useScrollDirection } from "../../hooks/useScrollDirection";

export function Layout() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrollingDown = useScrollDirection();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    console.log("🔒 Layout auth state:", { user, isLoading });
  }, [user, isLoading]);

  if (isLoading) {
    console.log("⌛ Layout: Loading...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log("⚠️ Layout: No user found");
    return null;
  }

  console.log("🎨 Layout: Rendering with user", user);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      >
        <Header onMenuChange={(isOpen) => setIsSidebarOpen(isOpen)} />
      </div>

      <div className="flex h-screen pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto p-6 lg:pl-72">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
