import React from "react";

import { Box, CircularProgress, Divider } from "@mui/material";

import PlanetLoader from "@/components/planet/PlanetLoader";

import { Planet } from "@/lib/types";

export default function PlanetPage() {
  return (
    <React.Fragment>
      <title>Planet Browser</title>

      <Box>
        <React.Suspense fallback={<CircularProgress size={100} />}>
          <PlanetLoader planets_promise={get_planets()} />
        </React.Suspense>
      </Box>
    </React.Fragment>
  );
}

async function get_planets(): Promise<Planet[]> {
  return fetch(process.env.url + "/api/planets").then((response) => response.json());
}
