import { useState, useEffect } from "react";
import { useDataStats } from "@/core/hooks/useDataStats";
import { useDataCleaning } from "@/core/hooks/useDataCleaning";
import { DeviceInfoCard } from "@/core/components/data-management/ClearComponents/DeviceInfoCard";
import { BackupRecommendationAlert } from "@/core/components/data-management/ClearComponents/BackupRecommendationAlert";
import { ClearAllDataDialog } from "@/core/components/data-management/ClearComponents/ClearAllDataDialog";
import { DataClearCard } from "@/core/components/data-management/ClearComponents/DataClearCard";

const ClearDataPage = () => {
  const [playerStation, setPlayerStation] = useState("");
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const { stats, refreshData, resetStats, updateMatchData } = useDataStats();
  const {
    handleClearScoutingData,
    handleClearScoutGameData,
    handleClearMatchData,
    handleClearAllData,
  } = useDataCleaning(refreshData, resetStats, updateMatchData);

  useEffect(() => {
    const station = localStorage.getItem("playerStation") || "";
    setPlayerStation(station);
  }, []);

  return (
    <div className="min-h-screen w-full px-4 pt-12 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start gap-4 max-w-2xl mb-6">
          <h1 className="text-2xl font-bold">Clear Data</h1>
          <p className="text-muted-foreground">
            Permanently delete stored data from this device. This action cannot be undone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <DeviceInfoCard playerStation={playerStation} />
          <BackupRecommendationAlert
            onClearAllClick={() => setShowClearAllConfirm(true)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <DataClearCard
            title="Scouting Data"
            description="Match scouting data collected on this device"
            entryCount={stats.scoutingDataCount}
            entryLabel="entries"
            storageSize={stats.scoutingDataSize}
            onClear={handleClearScoutingData}
          />

          <DataClearCard
            title="Scout Profiles"
            description="Scout names and their profile data"
            entryCount={stats.scoutGameDataCount}
            entryLabel="entries"
            storageSize={stats.scoutGameDataSize}
            onClear={handleClearScoutGameData}
            warningMessage={`This will permanently delete ${stats.scoutGameDataCount} scout profile entries.`}
          />

          <DataClearCard
            title="Match Schedule"
            description="Loaded match schedule used to fill in team numbers"
            entryCount={stats.matchDataCount}
            entryLabel="matches"
            storageSize={stats.matchDataSize}
            onClear={handleClearMatchData}
          />
        </div>
      </div>

      <ClearAllDataDialog
        open={showClearAllConfirm}
        onOpenChange={setShowClearAllConfirm}
        onConfirm={handleClearAllData}
        scoutingDataCount={stats.scoutingDataCount}
        scoutGameDataCount={stats.scoutGameDataCount}
        matchDataCount={stats.matchDataCount}
      />
    </div>
  );
};

export default ClearDataPage;
