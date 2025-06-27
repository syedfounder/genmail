"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const getInitials = () => {
    const firstInitial = user.firstName?.charAt(0);
    const lastInitial = user.lastName?.charAt(0);
    const emailInitial = user.primaryEmailAddress?.emailAddress.charAt(0);

    if (firstInitial && lastInitial) {
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    return (firstInitial || emailInitial || "").toUpperCase();
  };

  const initials = getInitials();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-secondary/80"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary hover:bg-primary/30 font-semibold">
              {initials ? initials : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-sans" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Manage Account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
