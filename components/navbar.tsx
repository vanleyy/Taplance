"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CornerRightDown, Moon, PartyPopper, Sun } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useTheme } from "next-themes";

interface NavBarProps {
  userAuthenticated: boolean;
}

const NavBar = ({ userAuthenticated }: NavBarProps) => {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="flex w-full justify-between px-2 sm:px-6 lg:px-28 h-20 items-center">
      <div className="flex items-center justify-between gap-2">
        <h1 className="scroll-m-20 text-center text-xl font-bold tracking-tight text-balance">
          Taplance
        </h1>
        <PartyPopper size={15} />
      </div>

      <div className="flex justify-center gap-2">
        {!userAuthenticated ? (
          <Link href="/login">
            <Button className="cursor-pointer">
              Get Started
              <CornerRightDown size={12} />
            </Button>
          </Link>
        ) : (
          <>
            {/* Logout Dialog */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button className="cursor-pointer">
                  Logout
                  <CornerRightDown size={12} />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to disconnect from your account? You
                    will need to log in again to continue.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                  >
                    Yes, Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {/* Dark Mode */}
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
