"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Plus,
  LogOut,
  Menu,
  X,
  Home,
  Settings,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isAuthenticated, getAdminUser, logout } from "@/lib/adminStore";
import { Logo, LogoMark } from "@/components/ui/Logo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, exact: true },
  { href: "/admin/imoveis", label: "Imóveis", icon: <Building2 className="h-4 w-4" /> },
  { href: "/admin/imoveis/novo", label: "Novo imóvel", icon: <Plus className="h-4 w-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname === "/admin/login") return;
    if (!isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setUser(getAdminUser());
  }, [pathname, router]);

  if (!mounted) return null;
  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAuthenticated()) return null;

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0B2344]">
      {/* Brand */}
      <div className="p-5 border-b border-white/8">
        <Logo variant="light" size="sm" />
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#C79A3B] text-white"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-70" />}
            </Link>
          );
        })}

        <div className="pt-3 border-t border-white/8 mt-3 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all"
          >
            <Home className="h-4 w-4" />
            Ver site
          </a>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/8">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/6 border border-white/8">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#C79A3B] to-[#a8812a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || "Admin"}</p>
            <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
            title="Sair"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-[#e2e6ed] flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0B2344]/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden shadow-2xl flex flex-col"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#e2e6ed] flex items-center px-4 sm:px-6 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-[#0B2344]/50 hover:text-[#0B2344] hover:bg-[#F7F8FA] transition-all lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-[#0B2344]/40">Admin</span>
            <span className="text-[#0B2344]/30">/</span>
            <span className="text-[#0B2344] font-medium">
              {navItems.find((item) => item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== "/admin")?.label || "Dashboard"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#0B2344]/50">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 text-sm text-[#0B2344]/40 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
