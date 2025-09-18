"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/useSession";
import { authClient } from "@/lib/auth-client"
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation";

export default function Header() {
  const { session, isLoading, revokeSession } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      revokeSession();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <header className="border-b border-border glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold gradient-text">
              Fomi
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
            Fomi
          </Link>
          <div className="flex gap-3 items-center">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity p-1 rounded-lg">
                    <img 
                      src={session.user.image || "https://i.pinimg.com/736x/43/0f/07/430f07ae232540762bb76d3da5e7e5e6.jpg"} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border-2 border-primary/20"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {session.user.name || "User"}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDashboard}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="gradient-primary text-primary-foreground glow-shadow hover:scale-105 transition-all">
                <Link href="/login">
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}