import { Link, useNavigate } from "react-router-dom";
import { Binoculars, CalendarDays, Moon, MoreVertical, QrCode, Trash2, Wrench } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { PageHelpTooltip } from "@/core/components/PageHelpTooltip";
import { useTheme } from "@/core/components/theme-provider";

export function SiteHeader() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) items-center gap-2 border-b bg-popover/95 px-4 py-2 backdrop-blur-sm">
      {/* Swap the icon + text for a logo later */}
      <Link
        to="/game-start"
        className="flex items-center gap-2 rounded-md px-2 py-1 font-semibold hover:bg-accent"
      >
        <Binoculars className="size-5" />
        Scout
      </Link>
      <div className="ml-auto flex items-center gap-1">
        <PageHelpTooltip />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="More options">
              <MoreVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/api-data")}>
              <CalendarDays className="size-4" />
              Load Match Schedule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/match-qr")}>
              <QrCode className="size-4" />
              Recent QR Codes
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Moon className="size-4" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/clear-data")}>
              <Trash2 className="size-4" />
              Clear Data
            </DropdownMenuItem>
            {import.meta.env.DEV && (
              <DropdownMenuItem onClick={() => navigate("/dev-utilities")}>
                <Wrench className="size-4" />
                Dev Utilities
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
