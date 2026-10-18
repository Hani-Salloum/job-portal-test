import { Menu } from "lucide-react";
import { AccountMenu } from "@/components/layout/account-menu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTranslation } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";

type TopbarProps = {
  title: string;
  subtitle: string;
  onOpenMobile: () => void;
  onLogout: () => Promise<void>;
};

export function Topbar({
  title,
  subtitle,
  onOpenMobile,
  onLogout,
}: TopbarProps) {
  const t = useTranslation();

  return (
    <header className="sticky top-5 z-20 flex min-h-[4.75rem] items-center justify-between gap-8 rounded-[45px] border border-border bg-chrome px-[clamp(1.25rem,3vw,2.5rem)] py-[.85rem] shadow-topbar max-sm:gap-3">
      <div className="flex items-center gap-3 max-sm:min-w-0">
        <Button
          className="lg:hidden"
          type="button"
          size="icon"
          variant="outline"
          aria-label={t("nav.open")}
          onClick={onOpenMobile}
        >
          <Menu aria-hidden="true" size={19} />
        </Button>
        <div className="max-sm:min-w-0">
          <h1 className="m-0 text-[1.25rem] tracking-[-.02em] max-sm:truncate">{title}</h1>
          {/*<p>{subtitle}</p>*/}
        </div>
      </div>
      <div className="flex items-center gap-[.65rem] rtl:flex-row-reverse">
        <LanguageSwitcher />
        <ThemeToggle />
        <AccountMenu onLogout={onLogout} />
      </div>
    </header>
  );
}
