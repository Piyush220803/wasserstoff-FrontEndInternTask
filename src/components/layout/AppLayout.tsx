"use client";

import type React from "react";
import { useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebarNav } from "@/components/navigation/AppSidebarNav";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Cog, LogIn } from "lucide-react";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, promptForUsername, isPrompting } = useUser();

  useEffect(() => {
    if (!user && !isPrompting) {
      promptForUsername();
    }
  }, [user, promptForUsername, isPrompting]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar className="border-r" collapsible="icon">
          <SidebarHeader className="p-4 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Cog className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
                CollabText
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <AppSidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 bg-background">
          <main className="p-6">
            {user ? (
              children
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
                <p className="text-lg text-muted-foreground mb-4">
                  Please enter your name to continue.
                </p>
                <Button onClick={promptForUsername} variant="outline">
                  <LogIn className="mr-2 h-4 w-4" /> Set Name
                </Button>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
