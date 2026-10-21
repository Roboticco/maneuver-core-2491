import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert";
import { Button } from "@/core/components/ui/button";

interface BackupRecommendationAlertProps {
  onClearAllClick: () => void;
}

export const BackupRecommendationAlert = ({ onClearAllClick }: BackupRecommendationAlertProps) => {
  return (
    <Alert>
      <AlertTitle className="col-start-2 line-clamp-1 min-h-4">💡 Before You Clear</AlertTitle>
      <AlertDescription className="space-y-3 col-start-2 grid justify-items-start gap-1 text-sm ">
        <p>Before clearing, make sure the lead scout has scanned every match. Missed ones can be re-shown from ⋮ → Recent QR Codes.</p>
        <p className="text-xs text-muted-foreground">
          ⚠️ The button below will completely reset this device, clearing ALL stored data including settings.
        </p>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onClearAllClick}
          className="w-full"
        >
          🗑️ Clear All Data
        </Button>
      </AlertDescription>
    </Alert>
  );
};
