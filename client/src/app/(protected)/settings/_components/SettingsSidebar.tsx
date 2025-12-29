"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Globe, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SettingsSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: User, label: "Profile", href: "/settings/profile" },
    { icon: Lock, label: "Security", href: "/settings/security" },
    { icon: Globe, label: "General", href: "/settings/general" },
    { icon: Shield, label: "Privacy", href: "/settings/privacy" },
  ];

  return (
    <aside className="hidden lg:block space-y-1">
      <nav className="flex flex-col gap-1 sticky top-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 rounded-lg text-sm"
        >
          <Trash2 size={16} />
          Delete Account
        </Button>
      </nav>
    </aside>
  );
}
