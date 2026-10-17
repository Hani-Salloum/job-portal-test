"use client";

import {
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AccountMenu } from "@/components/account-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  LocalizedLink,
  useLocalizedRouter,
  useTranslation,
} from "@/components/locale-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useLocalizedRouter();
  const t = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  async function signOut() {
     alert("signed out")
  }
  const primaryNavigation = [
    { label: t("nav.dashboard"), icon: LayoutDashboard, href: "/dashboard" },
  ];
  const plainPathname = pathname.replace(/^\/(?:en|ar)(?=\/|$)/, "") || "/";
  return (
    <main
      className={`dashboard${sidebarCollapsed ? " sidebar-collapsed" : ""}${mobileNavigationOpen ? " mobile-nav-open" : ""}`}
    >
      {mobileNavigationOpen && (
        <button
          className="sidebar-backdrop"
          aria-label={t("nav.close")}
          onClick={() => setMobileNavigationOpen(false)}
        />
      )}
      <aside className="sidebar">
        <Button
          className="sidebar-collapse"
          variant="outline"
          size="icon"
          aria-label={sidebarCollapsed ? t("nav.expand") : t("nav.collapse")}
          onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen aria-hidden="true" size={18} />
          ) : (
            <PanelLeftClose aria-hidden="true" size={18} />
          )}
        </Button>
        <div className="wordmark">
          <span className="rounded-none">
            <img className="rounded-md" src="/logo.png" />
          </span>
          <strong>Test Company</strong>
          <Button
            className="mobile-nav-close"
            variant="ghost"
            size="icon"
            aria-label={t("nav.close")}
            onClick={() => setMobileNavigationOpen(false)}
          >
            <X aria-hidden="true" size={19} />
          </Button>
        </div>
        <nav className="sidebar-nav" aria-label={t("nav.primary")}>
          {primaryNavigation.map(({ label, icon: Icon, href }) => {
            const active =
              plainPathname === href ||
              (href !== "/dashboard" && plainPathname.startsWith(`${href}/`));
            return (
              <Button
                variant="ghost"
                className={active ? "active" : ""}
                asChild
                key={href}
                title={sidebarCollapsed ? label : undefined}
              >
                <LocalizedLink
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileNavigationOpen(false)}
                >
                  <Icon
                    className="nav-icon"
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.75}
                  />
                  <span className="nav-label">{label}</span>
                </LocalizedLink>
              </Button>
            );
          })}
        </nav>
        <div className="account-block">
          <span className="profile-avatar">
            <UserRound aria-hidden="true" size={18} strokeWidth={1.5} />
          </span>
          <div className="account-copy">
            <strong>Hani Salloum</strong>
            <span className="account-kind">Admin</span>
          </div>
          <div className="account-actions">
            <TooltipProvider delayDuration={350}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="sign-out"
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    aria-label={t("account.logout")}
                  >
                    <LogOut aria-hidden="true" size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {t("account.logout")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <div className="topbar-heading">
            <Button
              className="mobile-nav-trigger"
              type="button"
              size="icon"
              variant="outline"
              aria-label={t("nav.open")}
              onClick={() => setMobileNavigationOpen(true)}
            >
              <Menu aria-hidden="true" size={19} />
            </Button>
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>
          <div className="topbar-actions">
            <LanguageSwitcher />
            <ThemeToggle />
            <AccountMenu onLogout={signOut} />
          </div>
        </header>
        <div className="page-content">{children}</div>
      </section>
    </main>
  );
}
