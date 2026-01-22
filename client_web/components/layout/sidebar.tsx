import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
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
      </SidebarContent>
    </Sidebar>
  );
}
