import React from "react";

import { Grid } from "@mui/material";

type Props = Readonly<{
  spacing?: number;
  children: React.ReactNode;
}>;

export default function GridContainer({ spacing, children }: Props) {
  return (
    <Grid container spacing={spacing ?? 2} sx={{ alignContent: "center", justifyContent: "center" }}>
      {children}
    </Grid>
  );
}
