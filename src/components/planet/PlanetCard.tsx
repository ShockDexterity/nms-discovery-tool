"use client";
import React, { SyntheticEvent } from "react";

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  DeleteForever as DeleteIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  PriorityHigh as ExclamationIcon,
} from "@mui/icons-material";

import { Planet } from "@/lib/types";
import { biome_border, descriptor_string } from "@/lib/functions";
import SentinelText from "@/components/planet/SentinelText";
import CenterBox from "@/components/general/CenterBox";

import { useRouter } from "next/navigation";
import SentinelIcon from "@/components/planet/SentinelIcon";
import MyTooltip from "@/components/general/MyTooltip";

type Props = Readonly<{ planet: Planet }>;

export default function PlanetCard({ planet }: Props) {
  const router = useRouter();

  const [open, setOpen] = React.useState<boolean>(false);

  // const handle_details = (event: SyntheticEvent) => {
  //   event.preventDefault();

  //   setOpen(!open);
  // };

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

  const planet_name = (
    <CenterBox rows>
      {planet.name}
      {planet.base && (
        <MyTooltip
          title={
            <Typography variant="body2" color="textSecondary">
              {planet.base_name}
            </Typography>
          }
        >
          <HomeIcon color="info" sx={{ ml: 0.5 }} />
        </MyTooltip>
      )}
      {<SentinelIcon level={planet.sentinels} />}
    </CenterBox>
  );

  return (
    <Card sx={biome_border(planet.extreme, planet.infested, planet.exotic)}>
      {/* <CardActionArea onClick={handle_details}> */}
      <CardHeader title={planet_name} subheader={descriptor_string(planet.descriptor, planet.moon, planet.biome)} />

      <CardContent>
        {/* <SentinelText level={planet.sentinels} /> */}

        {/* <Collapse in={open}> */}
        {/* <Divider sx={{ my: 1, width: "100%", color: "text.secondary" }}>
          {planet.extreme && "Extreme"}
          {planet.extreme && planet.infested && ", "}
          {planet.infested && !planet.biome.includes("Infested") && "Infested"} {planet.biome} Biome
        </Divider> */}
        <Typography variant="body2" color="textSecondary">
          {planet.resources.agricultural === "None" ? "No Agricultural Resource" : planet.resources.agricultural}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          {planet.resources.stellar.replace("Activated", "Act.")}, {planet.resources.local},{" "}
          {planet.resources.general.replace("Magnetized", "Mag.")}
        </Typography>
        {/* </Collapse> */}
      </CardContent>
      {/* </CardActionArea> */}

      <CardActions>
        <IconButton size="small" color="warning" href={`/planets/edit/${planet._id}`} sx={{ mr: 0.5 }}>
          <Tooltip title="Edit" arrow>
            <EditIcon />
          </Tooltip>
        </IconButton>

        <IconButton size="small" color="error" onClick={handle_delete} sx={{ ml: 0.5 }}>
          <Tooltip title="Delete" arrow>
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </CardActions>
    </Card>
  );
}
