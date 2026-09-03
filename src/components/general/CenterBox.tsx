import { ElementType } from "react";

import { Box } from "@mui/material";

type Props = Readonly<{
  component?: ElementType;
  rows?: boolean;
  children: React.ReactNode;
}>;

export default function CenterBox({ component = "div", rows = false, children }: Props) {
  if (rows) {
    return (
      <Box component={component} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {children}
      </Box>
    );
  }

  return (
    <Box component={component} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {children}
    </Box>
  );
}
