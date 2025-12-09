"use client";

import { useState } from "react";
import {
  ChevronUp,
  LogOut,
  Settings,
  User,
  Bell,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";

interface UserPanelProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

export function UserPanel({
  userName = "Alex Johnson",
  userEmail = "alex@pensieve.com",
  userImage,
}: UserPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, this would update your theme context/system
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      onClick: () => console.log("Profile clicked"),
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: () => console.log("Notifications clicked"),
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => console.log("Settings clicked"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => console.log("Help clicked"),
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card hover:bg-accent/50 border border-border transition-all duration-200 shadow-sm hover:shadow-md"
          aria-expanded={isOpen}
          aria-label="User menu"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {userImage ? (
              <img
                src={userImage || "/placeholder.svg"}
                alt={userName}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Info (hidden on mobile) */}
          <div className="hidden sm:flex flex-col gap-0.5 text-left">
            <span className="text-sm font-medium text-foreground leading-none">
              {userName.split(" ")[0]}
            </span>
            <span className="text-xs text-muted-foreground leading-none">
              Account
            </span>
          </div>

          {/* Chevron Icon */}
          <ChevronUp
            size={16}
            className={`text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-3 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="font-semibold text-foreground text-sm">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {userEmail}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-foreground hover:bg-accent/40 transition-colors duration-150 text-left"
                >
                  <item.icon
                    size={16}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-foreground hover:bg-accent/40 transition-colors duration-150 text-left"
            >
              {isDark ? (
                <>
                  <Sun
                    size={16}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon
                    size={16}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Logout */}
            <button
              onClick={() => {
                console.log("Logout clicked");
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150 text-left"
            >
              <LogOut size={16} className="flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Overlay (click outside to close) */}
        {isOpen && (
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
