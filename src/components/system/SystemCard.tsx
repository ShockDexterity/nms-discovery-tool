"use client";
import React, { SyntheticEvent } from "react";

import { Card, CardActions, CardContent, CardHeader, IconButton, Tooltip, Typography } from "@mui/material";

import {
  Bolt as BoltIcon,
  CreditCard as CreditCardIcon,
  DeleteForever as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

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

  const handle_claim = (event: SyntheticEvent) => {
    event.preventDefault();

    fetch(`http://localhost:3000/api/systems/${system._id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: system.name,
        faction: system.faction,
        abandoned: system.abandoned,
        econDescriptor: system.economy.descriptor,
        econState: system.economy.state,
        conflict: system.conflict,
        exosuit: true,
        v3: system.v3,
        atlas: system.atlas,
        blackhole: system.blackhole,
      }),
    })
      .then((api_response) => api_response.json())
      .then((response) => {
        if (response.error) {
          window.alert("There was an error. Check the console for more information");
          console.error(response.error);
          return;
        }

        console.log("claimed exosuit upgrade");

        if (response.warn) {
          window.alert(response.msg);
          console.warn("warning");
        } else {
          console.log("success");
        }

        router.replace("/systems");
      })
      .catch((reason) => {
        window.alert("There was an error. Check the console for more information");
        console.error("error caught in .catch");
        console.error("reason:", reason);
      });
  };

  const handle_v3 = (event: SyntheticEvent) => {
    event.preventDefault();

    fetch(`http://localhost:3000/api/systems/${system._id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: system.name,
        faction: system.faction,
        abandoned: system.abandoned,
        econDescriptor: system.economy.descriptor,
        econState: system.economy.state,
        conflict: system.conflict,
        exosuit: system.exosuit,
        v3: true,
        atlas: system.atlas,
        blackhole: system.blackhole,
      }),
    })
      .then((api_response) => api_response.json())
      .then((response) => {
        if (response.error) {
          window.alert("There was an error. Check the console for more information");
          console.error(response.error);
          return;
        }

        console.log("claimed exosuit upgrade");

        if (response.warn) {
          window.alert(response.msg);
          console.warn("warning");
        } else {
          console.log("success");
        }

        router.replace("/systems");
      })
      .catch((reason) => {
        window.alert("There was an error. Check the console for more information");
        console.error("error caught in .catch");
        console.error("reason:", reason);
      });
  };

  let sys_name = (
    <>
      {system.name}
      {!system.exosuit && <BoltIcon color="info" />}
      {/* {!system.v3 && <CreditCardIcon color="info" />} */}
    </>
  );

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
        <IconButton size="small" color="warning" href={`/systems/edit/${system._id}`} sx={{ mr: 0.5 }}>
          <Tooltip title="Edit" arrow>
            <EditIcon />
          </Tooltip>
        </IconButton>

        <IconButton size="small" color="error" onClick={handle_delete} sx={{ mx: 0.5 }}>
          <Tooltip title="Delete" arrow>
            <DeleteIcon />
          </Tooltip>
        </IconButton>

        {!system.exosuit && (
          <IconButton size="small" color="info" onClick={handle_claim} sx={{ ml: 0.5 }}>
            <Tooltip title="Claim Exosuit Upgrade" arrow>
              <BoltIcon />
            </Tooltip>
          </IconButton>
        )}

        {/* {!system.v3 && (
          <IconButton size="small" color="info" onClick={handle_v3} sx={{ ml: 0.5 }}>
            <Tooltip title="Claim Exosuit Upgrade" arrow>
              <CreditCardIcon />
            </Tooltip>
          </IconButton>
        )} */}
      </CardActions>
    </Card>
  );
}
