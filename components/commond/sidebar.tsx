"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { BarChart3, Users, CalendarDays, Settings, Home } from "lucide-react";
import { SidebarLink } from "./sidebar-link";

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
    exact: true,
  },
  {
    href: "/dashboard/estudiantes",
    label: "Estudiantes",
    icon: Users,
  },
  {
    href: "/dashboard/cursos",
    label: "Cursos",
    icon: CalendarDays,
  },
  {
    href: "/dashboard/sesiones",
    label: "Sesiones",
    icon: CalendarDays,
  },
  {
    href: "/dashboard/configuracion",
    label: "Configuración",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5" />
            <span>Alquimia Studio</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.map((item) => (
                <SidebarLink key={item.href} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <p>© 2024 Academia de Baile</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
