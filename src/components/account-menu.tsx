"use client";

import { ContactRound, LogOut, UserRound } from "lucide-react";
import { LocalizedLink, useTranslation } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function AccountMenu({
  onLogout,
}: {
  onLogout: () => Promise<void>;
}) {
  const t = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="topbar-profile"
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("account.openMenu", { name: "Hani Salloum" })}
        >
          <UserRound aria-hidden="true" size={17} strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="account-menu-content"
        align="end"
        aria-label={t("account.options")}
      >
        <DropdownMenuLabel className="account-menu-identity">
          <strong>Hani Salloum</strong>
          <span>Admin</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LocalizedLink href="/account/dashboard">
            <ContactRound aria-hidden="true" size={17} />
            {t("account.editProfile")}
          </LocalizedLink>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void onLogout()}>
          <LogOut aria-hidden="true" size={17} />
          {t("account.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
