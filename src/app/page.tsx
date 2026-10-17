import { redirectToRouteLocale } from "@/lib/route-locale";

export default async function Home() {
  await redirectToRouteLocale("/dashboard");
}
