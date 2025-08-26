import React from "react";

import { Typography } from "@mui/material";

type Props = {
  level: string;
  display: "card" | "dialog";
};

export default function SentinelText({ level, display }: Props) {
  const variant = display === "dialog" ? "body1" : "body2";
  const color = display === "dialog" ? "textPrimary" : "textSecondary";

  return (
    <Typography variant={variant} color={color} component="span">
      <Typography variant="inherit" component="span" sx={getStyle(level)}>
        {getLevelText(level)}
      </Typography>{" "}
      Sentinel Presence
    </Typography>
  );
}

function getLevelText(level: string) {
  switch (level) {
    case "low":
      return <>Low</>;
    case "high":
      return <>High</>;
    case "aggressive":
      return <b>AGGRESSIVE</b>;
    case "corrupt":
      return <>CORRUPT</>;
  }
}

type Border = {
  border: number;
  borderColor: string;
  borderRadius: string;
  bgcolor: string;
  color: string;
};

function getStyle(level: string): Border | {} {
  const border = 2;
  const borderRadius = `${border}px`;

  switch (level) {
    case "low":
      return {};

    case "high":
      return {
        border,
        borderColor: "warning.main",
        borderRadius,
        bgcolor: "warning.main",
        color: "black",
      };

    case "aggressive":
      return {
        border,
        borderColor: "error.main",
        borderRadius,
        bgcolor: "error.main",
        color: "black",
      };

    case "corrupt":
      return {
        border,
        borderColor: "secondary.main",
        borderRadius,
        bgcolor: "secondary.main",
        color: "black",
      };

    default:
      return {};
  }
}
