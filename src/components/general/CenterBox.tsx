import { ElementType } from "react";

import { Box } from "@mui/material";

type Props = Readonly<{
  component?: ElementType;
  children: React.ReactNode;
}>;

export default function CenterBox({ component = "div", children }: Props) {
  return (
    <Box component={component} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {children}
    </Box>
  );
}
