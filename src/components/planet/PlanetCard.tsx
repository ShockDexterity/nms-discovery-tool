import { SyntheticEvent } from "react";

import { Box, Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { Planet } from "@/lib/types";
import { biome_border, getDescriptor } from "@/lib/functions";
import SentinelText from "@/components/planet/SentinelText";

type Props = Readonly<{ planet: Planet }>;

export default function PlanetCard({ planet }: Props) {
  return (
    <Card sx={biome_border(planet.extreme, planet.infested, planet.exotic)}>
      <CardActionArea>
        <CardHeader
          title={planet.name}
          slotProps={{ title: { component: "h6" } }}
          subheader={getDescriptor(planet.descriptor, planet.moon)}
        />

        <CardContent>
          <SentinelText level={planet.sentinels} display="card" />

          <Typography variant="body2" color="textSecondary" component="p">
            {planet.system} System
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <IconButton size="small" color="warning" sx={{ mr: 2 }}>
          <EditIcon />
        </IconButton>

        <IconButton size="small" color="error" sx={{ ml: 2 }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
