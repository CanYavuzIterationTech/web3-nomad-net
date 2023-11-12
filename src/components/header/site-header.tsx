import Link from "next/link";

//import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
//import { CommandMenu } from "@/components/command-menu";
//import { Icons } from "@/components/icons";
//import { MainNav } from "@/components/main-nav";
//import { MobileNav } from "@/components/mobile-nav";
//import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="text-lg font-bold">
          <span className="text-green-600">Green</span>Social
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center">
            {/** */}

            <ConnectButton accountStatus="avatar" chainStatus="icon" />
          </nav>
        </div>
      </div>
    </header>
  );
}

/**
 * 
 * 
 *         <Link
              href={"github.com"}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={"https://twitter.com"}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
 */
