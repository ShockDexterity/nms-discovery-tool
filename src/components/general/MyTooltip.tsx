// react imports
import React from "react";

// mui component imports
import Tooltip from "@mui/material/Tooltip";

type Props = Readonly<{
  title: React.ReactElement;
  placement?:
    | "auto-end"
    | "auto-start"
    | "auto"
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
  no_arrow?: boolean;
  children: React.ReactElement;
}>;

export default function MyTooltip({ title, placement = "top", no_arrow = false, children }: Props) {
  return (
    <Tooltip
      title={title}
      arrow={no_arrow}
      placement={placement}
      slotProps={{
        tooltip: {
          sx: { backgroundColor: "#2F2F2F" },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
