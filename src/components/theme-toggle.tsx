"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function ThemeToggle() { const { resolvedTheme, setTheme } = useTheme(); const t = useTranslation(); const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); const isDark = mounted && resolvedTheme === "dark"; const nextTheme = isDark ? "light" : "dark"; function toggleTheme() { const applyTheme = () => setTheme(nextTheme); if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { applyTheme(); return; } document.startViewTransition(applyTheme); } return <TooltipProvider delayDuration={350}><Tooltip><TooltipTrigger asChild><Button type="button" size="icon" variant="outline" aria-label={isDark ? t("theme.light") : t("theme.dark")} onClick={toggleTheme}>{isDark ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}</Button></TooltipTrigger><TooltipContent>{isDark ? t("theme.lightLabel") : t("theme.darkLabel")}</TooltipContent></Tooltip></TooltipProvider>; }
