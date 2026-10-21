import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/core/components/ui/button';
import { toast } from 'sonner';
import { Copy, ArrowRight } from 'lucide-react';

interface MatchQRCodeProps {
  tabString: string;
  onDismiss: () => void;
}

export function MatchQRCode({ tabString, onDismiss }: MatchQRCodeProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(tabString).then(() => {
      toast.success('Copied to clipboard');
    }).catch(() => {
      toast.error('Copy failed — use your phone camera to scan');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6 gap-6">
      <h2 className="text-xl font-bold">Scan to Submit</h2>

      <div className="bg-white p-4 rounded-xl shadow-lg">
        <QRCodeSVG
          value={tabString}
          size={280}
          level="M"
          marginSize={1}
        />
      </div>

      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Scan with a phone camera — paste the result into the scouting spreadsheet as one row.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button variant="outline" onClick={handleCopy} className="w-full gap-2">
          <Copy className="h-4 w-4" />
          Copy Text
        </Button>
        <Button onClick={onDismiss} className="w-full gap-2">
          Next Match
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
