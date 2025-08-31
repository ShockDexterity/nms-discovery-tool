import React from "react";
import { Box } from "@mui/material";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function CenterBox({ children }: Props) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {children}
    </Box>
  );
}
