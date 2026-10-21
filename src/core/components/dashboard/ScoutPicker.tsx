import { useState } from "react";
import { ChevronsUpDown, UserPlus } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { cn } from "@/core/lib/utils";
import { useScout } from "@/core/contexts/ScoutContext";
import { ScoutDisplay } from "./ScoutDisplay";
import { ScoutSelectorContent } from "./ScoutSelectorContent";

export function ScoutPicker({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { currentScout, currentScoutStakes, scoutsList, addScout, removeScout } = useScout();

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "h-auto w-full justify-between gap-2 px-3 py-2",
          !currentScout && "border-amber-500 text-amber-600",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        {currentScout ? (
          <ScoutDisplay currentScout={currentScout} currentScoutStakes={currentScoutStakes} />
        ) : (
          <span className="flex items-center gap-2 font-medium">
            <UserPlus className="size-4" />
            Select or add scout
          </span>
        )}
        <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw] max-w-md p-0 top-[30%] translate-y-[-30%] sm:top-[50%] sm:translate-y-[-50%]">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Select Scout</DialogTitle>
          </DialogHeader>
          <ScoutSelectorContent
            currentScout={currentScout}
            scoutsList={scoutsList}
            onScoutSelect={addScout}
            onScoutRemove={removeScout}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
