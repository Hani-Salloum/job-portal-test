import {
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { LocalizedLink, useTranslation } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onLogout: () => Promise<void>;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslation();
  const primaryNavigation = [
    { label: t("nav.dashboard"), icon: LayoutDashboard, href: "/dashboard" },
    { label: t("nav.jobOpportunities"), icon: BriefcaseBusiness, href: "/dashboard/job-opportunities" },
  ];
  const plainPathname = pathname.replace(/^\/(?:en|ar)(?=\/|$)/, "") || "/";

  return (
    <aside
      className={`sticky top-[20px] z-40 mt-5 flex h-[calc(100dvh_-_40px)] min-h-0 flex-col rounded-[30px] border border-border bg-chrome px-4 py-6 text-foreground shadow-sidebar rtl:border-r-0 max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:h-dvh max-lg:w-[min(18rem,84vw)] max-lg:py-5 max-lg:shadow-drawer max-lg:transition-transform max-lg:duration-[220ms] max-lg:ease-[ease] max-lg:rtl:right-0 max-lg:rtl:left-auto max-lg:rtl:shadow-drawer-rtl ${collapsed ? "lg:px-[.7rem]" : ""} ${mobileOpen ? "max-lg:mt-0 max-lg:translate-x-0 max-lg:rounded-l-none max-lg:rounded-r-[30px] max-lg:rtl:rounded-l-[30px] max-lg:rtl:rounded-r-none" : "max-lg:-translate-x-[105%] max-lg:rtl:translate-x-[105%]"}`}
    >
      <Button
        className="absolute top-[1.45rem] -right-[25px] z-50 size-10 rounded-full border-border bg-surface text-foreground shadow-sidebar hover:bg-surface focus-visible:ring-0 focus-visible:ring-offset-0 rtl:right-auto rtl:-left-[25px] max-lg:hidden"
        variant="outline"
        size="icon"
        aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
        onClick={onToggleCollapse}
      >
        {collapsed ? (
          <PanelLeftOpen aria-hidden="true" size={18} />
        ) : (
          <PanelLeftClose aria-hidden="true" size={18} />
        )}
      </Button>
      <div className={`flex flex-none items-center gap-[.8rem] px-[.2rem] pb-6 font-bold max-lg:pb-5 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
        <span className="grid size-[2.3rem] flex-none place-items-center rounded-none text-[.8rem]">
          <img className="rounded-md" src="/logo.png" />
        </span>
        <strong className={`min-w-0 overflow-hidden whitespace-nowrap ${collapsed ? "lg:hidden" : ""}`}>Test Company</strong>
        <Button
          className="ml-auto text-muted-foreground hover:text-muted-foreground lg:hidden"
          variant="ghost"
          size="icon"
          aria-label={t("nav.close")}
          onClick={onCloseMobile}
        >
          <X aria-hidden="true" size={19} />
        </Button>
      </div>
      <nav className="grid min-h-0 flex-auto content-start gap-[.3rem] overflow-y-auto px-[.15rem] pt-1 pb-4 [scrollbar-width:thin]" aria-label={t("nav.primary")}>
        {primaryNavigation.map(({ label, icon: Icon, href }) => {
          const active =
            plainPathname === href ||
            (href !== "/dashboard" && plainPathname.startsWith(`${href}/`)) ||
            (href === "/dashboard/job-opportunities" &&
              (plainPathname.startsWith("/job-opportunities/") || plainPathname.startsWith("/applicants/")));
          return (
            <Button
              variant="ghost"
              className={`w-full justify-start rounded-[20px] px-4 whitespace-normal lg:px-5 ${collapsed ? "lg:justify-center lg:px-2" : ""} ${active ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
              asChild
              key={href}
              title={collapsed ? label : undefined}
            >
              <LocalizedLink
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={onCloseMobile}
              >
                <Icon
                  className="flex-none"
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.75}
                />
                <span className={`overflow-hidden text-ellipsis ${collapsed ? "lg:hidden" : ""}`}>{label}</span>
              </LocalizedLink>
            </Button>
          );
        })}
      </nav>
      <div className={`grid flex-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-border px-[.35rem] pt-4 ${collapsed ? "lg:grid-cols-1 lg:justify-items-center lg:px-0" : ""}`}>
        <span className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground">
          <UserRound aria-hidden="true" size={18} strokeWidth={1.5} />
        </span>
        <div className={`grid min-w-0 gap-[.15rem] ${collapsed ? "lg:hidden" : ""}`}>
          <strong className="overflow-hidden text-[.9rem] text-ellipsis whitespace-nowrap">Hani Salloum</strong>
          <span className="font-code text-[.62rem] tracking-[.06em] text-muted-foreground uppercase">Admin</span>
        </div>
        <div className={`flex items-center ${collapsed ? "lg:flex-col" : ""}`}>
          <TooltipProvider delayDuration={350}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="text-muted-foreground hover:bg-muted hover:text-foreground"
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
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
  );
}
