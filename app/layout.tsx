import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/user-server";
import { TasksProvider } from "@/contexts/tasks-context";
import { UserProvider } from "@/contexts/user-context";

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
        <UserProvider initialUser={user}>
          <SidebarProvider>
            <TasksProvider>
              <AppSidebar />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
              <Toaster />
            </TasksProvider>
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}
