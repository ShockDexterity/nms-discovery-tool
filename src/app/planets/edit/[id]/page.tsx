import React from "react";

import PlanetEditForm from "@/components/planet/PlanetEditForm";
import CenterBox from "@/components/general/CenterBox";
import { CircularProgress } from "@mui/material";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  return (
    <React.Suspense
      fallback={
        <CenterBox>
          <CircularProgress size={100} />
        </CenterBox>
      }
    >
      <PlanetEditForm planet_promise={get_planet(React.use(params).id)} />
    </React.Suspense>
  );
}

function get_planet(id: string) {
  return fetch("http://localhost:3000/api/planets/" + id, { method: "GET" }).then((resp) => resp.json());
}
