import type { ReactNode } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { toast } from 'sonner';
import { Copy, ArrowRight } from 'lucide-react';

interface MatchQRCodeProps {
  tabString: string;
  heading: string;
  details: string[];
  noShow?: boolean;
  onDismiss: () => void;
  children?: ReactNode;
}

export function MatchQRCode({ tabString, heading, details, noShow, onDismiss, children }: MatchQRCodeProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(tabString).then(() => {
      toast.success('Copied to clipboard');
    }).catch(() => {
      toast.error('Copy failed — use your phone camera to scan');
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-5 px-6 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{heading}</h2>
          <p className="mt-1 text-base text-muted-foreground">{details.join(' · ')}</p>
          {noShow && <Badge variant="destructive" className="mt-2">No Show</Badge>}
        </div>

        <div className="rounded-xl bg-white p-4 shadow-lg">
          <QRCodeSVG value={tabString} size={260} level="M" marginSize={1} />
        </div>

        {children}

        <div className="flex w-full flex-col gap-3">
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
    </div>
  );
}
