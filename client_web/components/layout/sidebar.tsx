"use client"
import { Calendar, ChevronUp, Home, Inbox, Search, Settings, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";

import {
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog"
import { RegisterDialog } from "../dialogs/RegisterDialog";
import { LoginDialog } from "../dialogs/LoginDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useUser } from "@/context/userContext";

// Menu items.
const items = [
  {
    title: "Play",
    url: "#",
    icon: Home,
  },
  {
    title: "Friends",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Leaderboard",
    url: "#",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const { user } = useUser()
  console.log("user: ", user)
  return (
      <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chess</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="py-5" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <div className="mt-4 w-full">
              <Dialog>
                <DialogTrigger asChild>
                <Button variant={"default"} className="w-full">
                  Login
                </Button>
              </DialogTrigger>
              <LoginDialog/>
              </Dialog>
              <div className="py-1" />

              <Dialog>
                <DialogTrigger asChild>
                <Button variant={"outline"} className="w-full">
                  Signup
                </Button>
              </DialogTrigger>
              <RegisterDialog/>
              </Dialog>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {user?.firstname}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
