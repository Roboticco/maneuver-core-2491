import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "@/core/db/database";
import { MatchQRCode } from "@/core/components/MatchQRCode";
import { cn } from "@/core/lib/utils";
import { serializeEntryToQrString } from "@/game-template/qr-export";

const RECENT_LIMIT = 5;

type Entry = Record<string, unknown>;

// "qm12" → "Qual 12", "sf3m1" → "Semi 3", "f1m2" → "Final 2"
function formatMatch(entry: Entry, short = false): string {
  const key = String(entry.matchKey ?? "");
  const qual = /^qm(\d+)$/.exec(key);
  if (qual) return short ? `Q${qual[1]}` : `Qual ${qual[1]}`;
  const semi = /^sf(\d+)m\d+$/.exec(key);
  if (semi) return short ? `SF${semi[1]}` : `Semi ${semi[1]}`;
  const final = /^f\d+m(\d+)$/.exec(key);
  if (final) return short ? `F${final[1]}` : `Final ${final[1]}`;
  return short ? `M${entry.matchNumber}` : `Match ${entry.matchNumber}`;
}

function formatStation(entry: Entry): string {
  const match = /^(red|blue)-([123])$/.exec(String(entry.driverStation ?? ""));
  if (match) return `${match[1] === "red" ? "Red" : "Blue"} ${match[2]}`;
  return entry.allianceColor === "red" ? "Red" : entry.allianceColor === "blue" ? "Blue" : "";
}

const MatchQRPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    db.scoutingData
      .orderBy("timestamp")
      .reverse()
      .limit(RECENT_LIMIT)
      .toArray()
      .then((rows) => setEntries(rows as unknown as Entry[]))
      .catch(() => setEntries([]));
  }, []);

  if (entries === null) return null;
  if (entries.length === 0) return <Navigate to="/game-start" replace />;

  const entry = entries[selected] ?? entries[0]!;

  return (
    <MatchQRCode
      tabString={serializeEntryToQrString(entry)}
      heading={`${formatMatch(entry)} · Team ${entry.teamNumber}`}
      details={[formatStation(entry), String(entry.scoutName ?? "")].filter(Boolean)}
      noShow={entry.noShow === true}
      onDismiss={() => navigate("/game-start")}
    >
      {entries.length > 1 && (
        <div className="w-full">
          <p className="pb-2 text-center text-xs text-muted-foreground">
            Recent matches on this device (newest first)
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {entries.map((row, index) => (
              <button
                key={String(row.id)}
                type="button"
                onClick={() => setSelected(index)}
                className={cn(
                  "flex flex-col items-center rounded-md border px-1 py-1.5 text-xs leading-tight transition-colors",
                  index === selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                )}
              >
                <span className="font-semibold">{formatMatch(row, true)}</span>
                <span>{String(row.teamNumber)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </MatchQRCode>
  );
};

export default MatchQRPage;
