import React from "react";

import { TextField } from "@mui/material";

import MyAutocomplete from "@/components/general/MyAutocomplete";

import { System } from "@/lib/types";
import { ErrorBoundary } from "react-error-boundary";

type Props = Readonly<{ system_list_promise: Promise<System[]>; defaultValue?: string }>;

export default function SystemAutocomplete({ system_list_promise, defaultValue = undefined }: Props) {
  return (
    <MyAutocomplete
      label="System Name"
      name="system"
      options={React.use(system_list_promise)
        .map((s) => s.name)
        .sort((a, b) => a.localeCompare(b))}
      defaultValue={defaultValue}
    />
  );
}
