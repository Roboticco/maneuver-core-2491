import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "@/core/db/database";
import { MatchQRCode } from "@/core/components/MatchQRCode";
import { serializeEntryToQrString } from "@/game-template/qr-export";

type QrState = { status: "loading" } | { status: "empty" } | { status: "ready"; qr: string };

const MatchQRPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<QrState>({ status: "loading" });

  useEffect(() => {
    db.scoutingData
      .orderBy("timestamp")
      .last()
      .then((entry) => {
        setState(entry
          ? { status: "ready", qr: serializeEntryToQrString(entry as unknown as Record<string, unknown>) }
          : { status: "empty" });
      })
      .catch(() => setState({ status: "empty" }));
  }, []);

  if (state.status === "loading") return null;
  if (state.status === "empty") return <Navigate to="/game-start" replace />;

  return <MatchQRCode tabString={state.qr} onDismiss={() => navigate("/game-start")} />;
};

export default MatchQRPage;
