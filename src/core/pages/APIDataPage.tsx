import { useState } from 'react';
import { CalendarDays, CheckCircle, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import { EventNameSelector } from '@/core/components/GameStartComponents/EventNameSelector';
import { DataAttribution } from '@/core/components/DataAttribution';
import { useTBAData } from '@/core/hooks/useTBAData';

function readLoadedSchedule(): { eventKey: string; matchCount: number } | null {
  try {
    const matches = JSON.parse(localStorage.getItem('matchData') || '[]');
    const eventKey = localStorage.getItem('eventKey') || '';
    return Array.isArray(matches) && matches.length > 0 && eventKey
      ? { eventKey, matchCount: matches.length }
      : null;
  } catch {
    return null;
  }
}

const APIDataPage = () => {
  const [eventKey, setEventKey] = useState(() => localStorage.getItem('eventKey') || '');
  const [loaded, setLoaded] = useState(readLoadedSchedule);
  const { matchDataLoading, fetchMatchDataFromTBA } = useTBAData();

  const handleLoad = async () => {
    // API key lives server-side in the api-proxy function
    await fetchMatchDataFromTBA('', eventKey, false, () => { });
    setLoaded(readLoadedSchedule());
  };

  return (
    <div className="min-h-screen w-full px-4 pt-12 pb-24">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Match Schedule</h1>
          <p className="text-muted-foreground">
            Load the qualification schedule so team numbers fill in automatically on Game Start.
          </p>
        </div>

        {loaded && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardContent className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
              <span className="text-green-800 dark:text-green-200">
                Loaded: <strong>{loaded.matchCount} matches</strong> from <strong>{loaded.eventKey}</strong>
              </span>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" />
              Event
            </CardTitle>
            <CardDescription>Pick the event, then load its schedule. Do this once per device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Event</Label>
              <EventNameSelector
                currentEventKey={eventKey}
                onEventKeyChange={setEventKey}
                showCustomEvents={false}
              />
            </div>
            <Button className="h-12 w-full" onClick={handleLoad} disabled={!eventKey || matchDataLoading}>
              {matchDataLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Schedule...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Load Match Schedule
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <DataAttribution sources={['tba']} variant="compact" />
      </div>
    </div>
  );
};

export default APIDataPage;
