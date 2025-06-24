"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
  exact?: boolean;
}

export function SidebarLink({
  href,
  label,
  icon: Icon,
  tooltip,
  exact = false,
}: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={tooltip || label}>
        <Link href={href}>
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
