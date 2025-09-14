"use client";
import React, { SyntheticEvent } from "react";

import { Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { Planet } from "@/lib/types";
import { biome_border, descriptor_string } from "@/lib/functions";
import SentinelText from "@/components/planet/SentinelText";

import { useRouter } from "next/navigation";

type Props = Readonly<{ planet: Planet }>;

export default function PlanetCard({ planet }: Props) {
  const router = useRouter();

  const handle_details = (event: SyntheticEvent) => {
    event.preventDefault();

    console.log("details button clicked");
  };

  const handle_delete = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (window.confirm(`Are you sure you want to delete "${planet.name}"?`)) {
      const response = await fetch(`./api/planets/${planet._id}`, {
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

  return (
    <Card sx={biome_border(planet.extreme, planet.infested, planet.exotic)}>
      <CardActionArea onClick={handle_details}>
        <CardHeader
          title={planet.name}
          slotProps={{ title: { component: "h6" } }}
          subheader={descriptor_string(planet.descriptor, planet.moon)}
        />

        <CardContent>
          <SentinelText level={planet.sentinels} display="card" />

          <Typography variant="body2" color="textSecondary" component="p">
            {planet.system} System
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <IconButton size="small" color="warning" href={`/planets/edit/${planet._id}`} sx={{ mr: 2 }}>
          <EditIcon />
        </IconButton>

        <IconButton size="small" color="error" onClick={handle_delete} sx={{ ml: 2 }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
