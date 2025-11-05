"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import {
  Calendar,
  Home,
  CheckCircle,
  Settings,
  Layers,
  SidebarIcon,
  Plus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { UserButton } from "@/components/layout/user-button";
import { useState } from "react";
import { CreateDialog } from "./create-dialog";

const navItems = [
  { title: "Overview", url: "/overview", icon: Home },
  { title: "Tasks", url: "/tasks", icon: CheckCircle },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  user: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { open, toggleSidebar } = useSidebar();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b">
          <SidebarMenu>
            <SidebarMenuButton
              className="group/icon"
              size="lg"
              onClick={toggleSidebar}
              asChild
            >
              <div>
                <button className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  {open ? (
                    <Layers className="size-5" />
                  ) : (
                    <>
                      <Layers className="size-5 transition-opacity group-hover/icon:opacity-0" />
                      <SidebarIcon className="absolute size-5 hover:cursor-e-resize opacity-0 transition-opacity group-hover/icon:opacity-100" />
                    </>
                  )}
                </button>

                <span className="text-xl font-semibold">Tokido</span>
                <SidebarTrigger className="ml-auto hover:cursor-w-resize" />
              </div>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="pb-0">
            <SidebarMenu>
              <SidebarMenuButton
                size="lg"
                variant="outline"
                className="border shadow-sm cursor-pointer"
                onClick={() => setIsCreateDialogOpen(true)}
                asChild
              >
                <div>
                  <button className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Plus className="size-5" />
                  </button>
                  <span className="text-lg font-semibold">Create</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="py-0">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t">
          <UserButton user={user} />
        </SidebarFooter>
      </Sidebar>
      <CreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}
