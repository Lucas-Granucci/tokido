"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, CheckCircle, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateDialog } from "@/contexts/create-dialog-context";

export function MobileNav() {
  const pathname = usePathname();
  const { openCreateDialog } = useCreateDialog();

  const navItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Tasks", url: "/tasks", icon: CheckCircle },
    { title: "Create", icon: Plus, action: openCreateDialog, isMain: true },
    { title: "Calendar", url: "/calendar", icon: Calendar },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid h-16 grid-cols-5 items-center">
        {navItems.map((item) => {
          const isActive = item.url ? pathname === item.url : false;

          if (item.isMain) {
            return (
              <button
                key={item.title}
                onClick={item.action}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="mt-1 text-xs font-medium">{item.title}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.url!}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground",
                isActive && "text-primary font-medium"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
