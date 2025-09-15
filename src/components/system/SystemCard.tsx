"use client";
import React, { SyntheticEvent } from "react";

import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { System } from "@/lib/types";
import { system_border } from "@/lib/functions";

import { useRouter } from "next/navigation";

type Props = Readonly<{ system: System }>;

export default function SystemCard({ system }: Props) {
  const router = useRouter();

  const handle_delete = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (window.confirm(`Are you sure you want to delete "${system.name}"?`)) {
      const response = await fetch(`./api/systems/${system._id}`, {
        method: "DELETE",
      }).then((resp) => resp.json());

      if (response.error) {
        console.error(response);
      } else {
        console.log(response);
      }
    }

    router.refresh();
  };

  const sys_name = system.exosuit ? system.name : `${system.name}*`;

  return (
    <Card sx={system_border(system.atlas, system.blackhole)}>
      <CardHeader title={sys_name} subheader={system.faction} />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {system.economy.strength} {system.economy.type.replace("Advanced", "Adv.")} Economy
        </Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          {system.conflict} Conflict
        </Typography>
      </CardContent>

      <CardActions>
        <IconButton size="small" color="warning" href={`/systems/edit/${system._id}`} sx={{ mr: 2 }}>
          <EditIcon />
        </IconButton>

        <IconButton size="small" color="error" onClick={handle_delete} sx={{ ml: 2 }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
