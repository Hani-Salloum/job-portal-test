import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, localePath, type Locale } from "./i18n";


export async function currentRouteLocale(): Promise<Locale> {
  const locale = (await headers()).get("x-route-locale");
  return isLocale(locale) ? locale : "en";
}

export async function redirectToRouteLocale(path: string): Promise<never> {
  redirect(localePath(path, await currentRouteLocale()));
}
