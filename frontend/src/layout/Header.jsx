import logo from "@/assets/images/logo.png";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img className="h-10 w-auto" src={logo} alt="Menu Generator" />
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <h1 className="text-base font-semibold tracking-tight">
            Menu Generator
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/my-menus"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hidden sm:inline-flex"
            )}
          >
            My Menus
          </Link>
          <Link to="/my-menus" className={buttonVariants()}>
            Create
          </Link>
        </div>
      </div>
    </header>
  );
};
