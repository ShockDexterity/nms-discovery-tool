import React from "react";

import { CircularProgress } from "@mui/material";

import CenterBox from "@/components/general/CenterBox";

import { System } from "@/lib/types";
import SystemLoader from "@/components/system/SystemLoader";

export default function SystemPage() {
  return (
    <React.Fragment>
      <title>System Browser</title>

      <React.Suspense
        fallback={
          <CenterBox>
            <CircularProgress size={100} />
          </CenterBox>
        }
      >
        <SystemLoader systems_promise={get_systems()} />
      </React.Suspense>
    </React.Fragment>
  );
}

async function get_systems(): Promise<System[]> {
  return fetch(process.env.url + "/api/systems").then((response) => response.json());
}
