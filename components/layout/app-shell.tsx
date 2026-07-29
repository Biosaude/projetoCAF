"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import { navigation, product } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const ProductIcon = product.icon;
  const sidebar = (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white">
          <ProductIcon className="size-5" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-white">{product.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">
              {product.descriptor}
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {navigation.map((group) => (
          <div key={group.label}>
            <p
              className={cn(
                "mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-600",
                collapsed && "sr-only",
              )}
            >
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "hover:bg-slate-900 hover:text-white",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <button
        onClick={() => setCollapsed((value) => !value)}
        className="hidden h-12 items-center justify-center border-t border-slate-800 text-slate-500 hover:bg-slate-900 hover:text-white lg:flex"
      >
        {collapsed ? (
          <ChevronRight className="size-4" />
        ) : (
          <>
            <ChevronLeft className="mr-2 size-4" />
            <span className="text-xs">Recolher menu</span>
          </>
        )}
      </button>
    </aside>
  );
  return (
    <div className="min-h-screen bg-slate-50">
      {sidebar}
      {mobileOpen && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "transition-[margin] duration-300",
          collapsed ? "lg:ml-20" : "lg:ml-64",
        )}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </Button>
            <div className="hidden h-9 w-72 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 md:flex">
              <Search className="size-4" />
              Buscar no sistema...
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="size-5" />
            </Button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-900">
                  Administrador
                </p>
                <p className="text-[11px] text-slate-500">Ambiente seguro</p>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
