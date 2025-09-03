import React from "react";

import { CircularProgress } from "@mui/material";

import CenterBox from "@/components/general/CenterBox";
import PlanetLoader from "@/components/planet/PlanetLoader";

import { Planet } from "@/lib/types";

export default function PlanetPage() {
  return (
    <React.Fragment>
      <title>Planet Browser</title>

      <React.Suspense
        fallback={
          <CenterBox>
            <CircularProgress size={100} />
          </CenterBox>
        }
      >
        <PlanetLoader planets_promise={get_planets()} />
      </React.Suspense>
    </React.Fragment>
  );
}

async function get_planets(): Promise<Planet[]> {
  return fetch(process.env.url + "/api/planets").then((response) => response.json());
}
