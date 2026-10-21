import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronsUpDown, Moon, MoreVertical, Trash2, Wrench } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
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
import { useScout } from "@/core/contexts/ScoutContext";
import { ScoutDisplay } from "./ScoutDisplay";
import { ScoutSelectorContent } from "./ScoutSelectorContent";

export function SiteHeader() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [scoutDialogOpen, setScoutDialogOpen] = useState(false);
  const { currentScout, currentScoutStakes, scoutsList, addScout, removeScout } = useScout();

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) items-center gap-2 border-b bg-popover/95 px-4 py-2 backdrop-blur-sm">
      <Button
        variant="ghost"
        className="h-auto min-w-0 justify-start gap-2 px-2"
        onClick={() => setScoutDialogOpen(true)}
      >
        {currentScout ? (
          <ScoutDisplay currentScout={currentScout} currentScoutStakes={currentScoutStakes} />
        ) : (
          <span className="font-medium text-amber-600">Select Scout</span>
        )}
        <ChevronsUpDown className="size-4 shrink-0" />
      </Button>

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

      <Dialog open={scoutDialogOpen} onOpenChange={setScoutDialogOpen}>
        <DialogContent className="w-[90vw] max-w-md p-0 top-[30%] translate-y-[-30%] sm:top-[50%] sm:translate-y-[-50%]">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Select Scout</DialogTitle>
          </DialogHeader>
          <ScoutSelectorContent
            currentScout={currentScout}
            scoutsList={scoutsList}
            onScoutSelect={addScout}
            onScoutRemove={removeScout}
            onClose={() => setScoutDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </header>
  );
}
