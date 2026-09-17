// react imports
import React from "react";

// mui component imports
import Grid from "@mui/material/Grid";

type Props = Readonly<{
  size?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number } | undefined;
  children: React.ReactNode;
}>;

export default function GridItem({ size, children }: Props) {
  return (
    <Grid size={size ?? { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }} sx={{ width: "100%" }}>
      {children}
    </Grid>
  );
}
