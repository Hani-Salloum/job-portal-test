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
          className="grid size-[2.45rem] place-items-center rounded-full border-border bg-surface p-0 text-muted-foreground hover:bg-surface"
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("account.openMenu", { name: "Hani Salloum" })}
        >
          <UserRound aria-hidden="true" size={17} strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        aria-label={t("account.options")}
      >
        <DropdownMenuLabel className="-mx-1 -mt-1 grid gap-[.15rem] bg-chrome px-4 py-[.85rem]">
          <strong className="overflow-hidden text-[.88rem] text-ellipsis whitespace-nowrap">Hani Salloum</strong>
          <span className="font-code text-[.62rem] tracking-[.06em] text-muted-foreground uppercase">Admin</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LocalizedLink href="/dashboard">
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
