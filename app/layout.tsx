import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/user-server";
import { TasksProvider } from "@/contexts/tasks-context";
import { UserProvider } from "@/contexts/user-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { CreateDialog } from "@/components/layout/create-dialog";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CreateDialogProvider } from "@/contexts/create-dialog-context";
import { EventsProvider } from "@/contexts/events-context";
import { SettingsProvider } from "@/contexts/settings-context";

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
      <body className="flex h-screen overflow-hidden bg-muted/30 text-foreground">
        <UserProvider initialUser={user}>
          <AuthGuard>
            <SettingsProvider>
              <SidebarProvider>
                <TasksProvider>
                  <EventsProvider>
                    <CreateDialogProvider>
                      <AppSidebar />
                      <main className="flex flex-1 flex-col overflow-hidden p-4 pb-20 md:p-6 md:pb-6 min-h-0">
                        {children}
                      </main>
                      <MobileNav />
                      <CreateDialog />
                    </CreateDialogProvider>
                  </EventsProvider>
                </TasksProvider>
              </SidebarProvider>
            </SettingsProvider>
          </AuthGuard>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
