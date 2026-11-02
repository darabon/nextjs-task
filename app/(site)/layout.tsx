import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
