"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Building,
  FileText,
  Heart,
  Home,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AppSidebar = ({ userType }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const navLinks =
    userType === "manager"
      ? [
          { icon: Building, label: "Properties", href: "/managers/properties" },
          {
            icon: FileText,
            label: "Applications",
            href: "/managers/applications",
          },
          { icon: Settings, label: "Settings", href: "/managers/settings" },
        ]
      : [
          { icon: Heart, label: "Favorites", href: "/tenants/favorites" },
          {
            icon: FileText,
            label: "Applications",
            href: "/tenants/applications",
          },
          { icon: Home, label: "Residences", href: "/tenants/residences" },
          { icon: Settings, label: "Settings", href: "/tenants/settings" },
        ];

  // If sidebar is closed, only render a small toggle button
  if (!open) {
    return (
      <div 
        className="fixed top-0 left-0 z-50"
        style={{
          top: `${NAVBAR_HEIGHT + 10}px`,
        }}
      >
        <button
          className="bg-white shadow-md hover:bg-gray-100 p-2 rounded-r-md"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 bg-white shadow-lg"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-between items-center pt-3 mb-3 px-6 min-h-[56px] w-full">
              <h1 className="text-xl font-bold text-gray-800">
                {userType === "manager" ? "Manager View" : "Renter View"}
              </h1>
              <button
                className="hover:bg-gray-100 p-2 rounded-md"
                onClick={toggleSidebar}
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center px-7 py-7",
                    isActive
                      ? "bg-gray-100"
                      : "text-gray-600 hover:bg-gray-100",
                    "text-blue-600"
                  )}
                >
                  <Link href={link.href} className="w-full" scroll={false}>
                    <div className="flex items-center gap-3">
                      <link.icon
                        className={`h-5 w-5 ${
                          isActive ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          isActive ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;