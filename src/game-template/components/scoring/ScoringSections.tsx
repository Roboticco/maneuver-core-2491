/**
 * 2026 REBUILT Scoring Sections
 *
 * Button-counter interface for the 2026 game.
 * Scouts tap buttons live during the match; actions are collected into an array
 * and counted by transformation.ts at submit time.
 *
 * Actions fired:
 *   { actionType: 'fuelScored' | 'shotOnTheMove' | 'shotStationary'
 *                | 'depotCollect' | 'outpostCollect' | 'fuelPassed'
 *                | 'foulCommitted' | 'steal' }
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";

interface ScoringSectionsProps {
  phase: 'auto' | 'teleop';
  onAddAction: (action: any) => void;
  actions: any[];
  onUndo?: () => void;
  canUndo?: boolean;
  matchNumber?: string | number;
  matchType?: 'qm' | 'sf' | 'f';
  teamNumber?: string | number;
  onBack?: () => void;
  onProceed?: () => void;
}

function count(actions: any[], actionType: string) {
  return actions.filter(a => a.actionType === actionType).length;
}

function ActionButton({
  label,
  actionType,
  actions,
  onAddAction,
  phase,
  className,
}: {
  label: string;
  actionType: string;
  actions: any[];
  onAddAction: (a: any) => void;
  phase: string;
  className?: string;
}) {
  const n = count(actions, actionType);
  return (
    <Button
      onClick={() => onAddAction({ actionType, phase })}
      variant="outline"
      className={`h-16 flex flex-col items-center justify-center gap-1 ${className ?? ''}`}
    >
      <span className="font-medium">{label}</span>
      {n > 0 && (
        <span className="text-lg font-bold text-primary">{n}</span>
      )}
    </Button>
  );
}

export function ScoringSections({
  phase,
  onAddAction,
  actions = [],
}: ScoringSectionsProps) {
  return (
    <div className="space-y-4">

      {/* Fuel Scoring */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fuel Scoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ActionButton
            label="Fuel Scored"
            actionType="fuelScored"
            actions={actions}
            onAddAction={onAddAction}
            phase={phase}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            <ActionButton
              label="Shot: On The Move"
              actionType="shotOnTheMove"
              actions={actions}
              onAddAction={onAddAction}
              phase={phase}
            />
            <ActionButton
              label="Shot: Stationary"
              actionType="shotStationary"
              actions={actions}
              onAddAction={onAddAction}
              phase={phase}
            />
          </div>
        </CardContent>
      </Card>

      {/* Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <ActionButton
              label="Depot"
              actionType="depotCollect"
              actions={actions}
              onAddAction={onAddAction}
              phase={phase}
            />
            <ActionButton
              label="Outpost"
              actionType="outpostCollect"
              actions={actions}
              onAddAction={onAddAction}
              phase={phase}
            />
          </div>
        </CardContent>
      </Card>

      {/* Other */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Other</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <ActionButton
              label="Fuel Passed"
              actionType="fuelPassed"
              actions={actions}
              onAddAction={onAddAction}
              phase={phase}
            />
            <ActionButton
              label="Foul"
              actionType="foulCommitted"
              actions={actions}
              onAddAction={onAddAction}
              phase={phase}
            />
            {phase === 'teleop' && (
              <ActionButton
                label="Steal"
                actionType="steal"
                actions={actions}
                onAddAction={onAddAction}
                phase={phase}
              />
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
