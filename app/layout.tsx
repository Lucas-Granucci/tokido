import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/user-server";

export const metadata = {
  title: "Tokido",
  icons: {
    icon: "/layers.svg",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const { user } = await getCurrentUser();

  return (
    <html lang="en">
      <body className="flex h-screen bg-muted/30 text-foreground">
        <SidebarProvider>
          <AppSidebar user={user} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
