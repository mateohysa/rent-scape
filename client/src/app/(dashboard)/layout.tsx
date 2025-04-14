"use client";

import Navbar from "@/components/Navbar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import Sidebar from "@/components/AppSidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";

// Constants for sidebar widths
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_COLLAPSED = "0";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { open } = useSidebar();
  
  return (
    <div 
      className="flex-grow transition-all duration-300"
      style={{ 
        marginLeft: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED,
        width: open ? `calc(100% - ${SIDEBAR_WIDTH})` : '100%',
        padding: '1.5rem'
      }}
    >
      {children}
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/tenants")) ||
        (userRole === "tenant" && pathname.startsWith("/managers"))
      ) {
        router.push(
          userRole === "manager"
            ? "/managers/properties"
            : "/tenants/favorites",
          { scroll: false }
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) return <>Loading...</>;
  if (!authUser?.userRole) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />
        <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <Sidebar userType={authUser.userRole.toLowerCase()} />
            <MainContent>{children}</MainContent>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;