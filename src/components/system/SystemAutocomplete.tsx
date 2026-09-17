// react imports
import React from "react";

// custom component imports
import MyAutocomplete from "@/components/general/MyAutocomplete";

// custom info imports
import { System } from "@/lib/types";

type Props = Readonly<{ system_list_promise: Promise<System[]>; defaultValue?: string }>;

export default function SystemAutocomplete({ system_list_promise, defaultValue = undefined }: Props) {
  return (
    <MyAutocomplete
      label="System Name"
      name="system"
      options={React.use(system_list_promise)
        .sort((a, b) => b._id.localeCompare(a._id))
        .map((s) => s.name)}
      defaultValue={defaultValue}
    />
  );
}
