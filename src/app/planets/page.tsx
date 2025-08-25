import React from "react";

import { Box } from "@mui/material";

import PlanetLoader from "@/components/planet/PlanetLoader";

import { Planet } from "@/lib/types";

export default function PlanetPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <React.Suspense fallback={<div>Loading...</div>}>
        <PlanetLoader planets_promise={get_planets()} />
      </React.Suspense>
    </Box>
  );
}

async function get_planets(): Promise<Planet[]> {
  return fetch(process.env.url + "/api/planets").then((response) => response.json());
}
