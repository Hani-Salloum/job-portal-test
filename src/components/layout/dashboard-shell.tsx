"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useTranslation } from "@/components/locale-provider";

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const t = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  function toggleSidebar() {
    setSidebarCollapsed((collapsed) => !collapsed);
  }

  function openMobileNavigation() {
    setMobileNavigationOpen(true);
  }

  function closeMobileNavigation() {
    setMobileNavigationOpen(false);
  }

  async function signOut() {
    alert("signed out");
  }

  return (
    <main
      className={`mx-5 mb-5 block min-h-[calc(100dvh_-_40px)] gap-2.5 transition-[grid-template-columns] duration-[220ms] ease-[ease] lg:grid ${sidebarCollapsed ? "lg:grid-cols-[5rem_minmax(0,1fr)]" : "lg:grid-cols-[17rem_minmax(0,1fr)]"}`}
    >
      {mobileNavigationOpen && (
        <button
          className="hidden max-lg:fixed max-lg:inset-0 max-lg:z-30 max-lg:block max-lg:border-0 max-lg:bg-overlay max-lg:backdrop-blur-[2px]"
          aria-label={t("nav.close")}
          onClick={closeMobileNavigation}
        />
      )}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileNavigationOpen}
        onToggleCollapse={toggleSidebar}
        onCloseMobile={closeMobileNavigation}
        onLogout={signOut}
      />
      <section className="min-w-0">
        <Topbar
          title={title}
          subtitle={subtitle}
          onOpenMobile={openMobileNavigation}
          onLogout={signOut}
        />
        <div className="p-5 lg:p-[clamp(1.5rem,5vw,4rem)]">{children}</div>
      </section>
    </main>
  );
}
