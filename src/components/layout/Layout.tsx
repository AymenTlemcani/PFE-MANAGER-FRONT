import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-10">
          <div className="h-full px-6 flex items-center">
            <Header />
          </div>
        </div>
        <main className="pt-20 px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
