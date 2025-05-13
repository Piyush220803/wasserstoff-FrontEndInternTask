// src/components/navigation/AppSidebarNav.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Edit3, UserCircle } from 'lucide-react'; // Removed Library, Bot icons
import { useUser } from '@/hooks/useUser';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Kept AvatarImage if needed for user profile, but removed from example import.

const navItems = [
  { href: '/editor', label: 'Editor', icon: Edit3 },
  // { href: '/components-demo', label: 'Components Demo', icon: Library }, // Removed
  // { href: '/ai-assistant', label: 'AI Assistant', icon: Bot }, // Removed
];

export function AppSidebarNav() {
  const pathname = usePathname();
  const { user, setUser } = useUser();

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="flex flex-col h-full p-2">
      <SidebarMenu className="flex-1">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={{ children: item.label, className: "bg-card text-card-foreground border-border" }}
                className="w-full"
              >
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      {user && (
        <div className="mt-auto p-2 border-t border-border group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-none">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-8 w-8" style={{ backgroundColor: user.color || '#ccc' }}>
              <AvatarFallback className="text-white font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">{user.name}</p>
              <button 
                onClick={() => setUser(null)} 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
