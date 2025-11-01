import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Tokido",
  icons: {
    icon: "/layers.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="flex h-screen bg-muted/30 text-foreground">
        <SidebarProvider>
          <AppSidebar user={user} />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
