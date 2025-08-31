import React, { SyntheticEvent } from "react";

import { Box, Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { Planet } from "@/lib/types";
import { biome_border, descriptor_string } from "@/lib/functions";
import SentinelText from "@/components/planet/SentinelText";

type Props = Readonly<{ planet: Planet }>;

export default function PlanetCard({ planet }: Props) {
  const handle_details = (event: SyntheticEvent) => {
    event.preventDefault();

    console.log("details button clicked");
  };

  const handle_edit = (event: SyntheticEvent) => {
    event.preventDefault();

    console.log("edit button clicked");
  };

  const handle_delete = (event: SyntheticEvent) => {
    event.preventDefault();

    console.log("delete button clicked");
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
        <IconButton size="small" color="warning" onClick={handle_edit} sx={{ mr: 2 }}>
          <EditIcon />
        </IconButton>

        <IconButton size="small" color="error" onClick={handle_delete} sx={{ ml: 2 }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
