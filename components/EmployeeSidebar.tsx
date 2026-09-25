"use client";

import { BookCheck, FilePen, Home, MailWarning, Megaphone } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DeleteConfirmation from "./modals/ConfirmationModal";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/employee",
    icon: Home,
  },
  {
    title: "Attendance",
    url: `/employee/attendance/`,
    icon: BookCheck,
  },
  {
    title: "Leave Applications",
    url: "/employee/leave-applications",
    icon: FilePen,
  },
  {
    title: "Complaints",
    url: "/employee/complaints",
    icon: MailWarning,
  },
  {
    title: "Notice Board",
    url: "/employee/notice-board",
    icon: Megaphone,
  },
  {
    title: "Profile",
    url: "/employee/profile",
    icon: Megaphone,
  },
];

export default function EmployeeSidebar() {
  const { toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleMobileToggle = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("failed to logout");
      }

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="pl-3 pt-3 border-b font-semibold">
        <div className="flex items-center gap-3 text-wrap">
          <Image src="/images/logo.png" alt="logo" height={80} width={80} />
          <span>MMS Attendance System</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} onClick={handleMobileToggle}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === pathname}
                    size="lg"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DeleteConfirmation
          pendingFunction={() => handleLogout()}
          variant="destructive"
          btnTitle="Logout"
          logoutIcon
          title="Are you sure you want to logout?"
          message=""
        />
      </SidebarFooter>
    </Sidebar>
  );
}
