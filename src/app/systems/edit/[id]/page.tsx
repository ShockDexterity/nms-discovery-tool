import React from "react";

import { CircularProgress } from "@mui/material";

import SystemEditForm from "@/components/system/SystemEditForm";
import CenterBox from "@/components/general/CenterBox";

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
      <SystemEditForm system_promise={get_system(React.use(params).id)} />
    </React.Suspense>
  );
}

function get_system(id: string) {
  return fetch("http://localhost:3000/api/systems/" + id, { method: "GET" }).then((resp) => resp.json());
}
