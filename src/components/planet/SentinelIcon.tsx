import React from "react";

import { Tooltip } from "@mui/material";
import { PriorityHigh as ExclamationIcon } from "@mui/icons-material";
import SentinelText from "@/components/planet/SentinelText";
import MyTooltip from "@/components/general/MyTooltip";

type Props = { level: string };

export default function SentinelIcon({ level }: Props) {
  const color = level === "aggressive" ? "error" : level === "corrupt" ? "info" : level === "high" ? "warning" : "none";

  if (color === "none") {
    return <></>;
  }

  return (
    <MyTooltip title={<SentinelText level={level} />}>
      <ExclamationIcon color={color} />
    </MyTooltip>
  );
}
