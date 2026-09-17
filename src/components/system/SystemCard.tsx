"use client";

// react imports
import { SyntheticEvent } from "react";

// mui component imports
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// mui icon imports
import BoltIcon from "@mui/icons-material/Bolt";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

// custom component imports
import CenterBox from "@/components/general/CenterBox";

// custom info imports
import { System } from "@/lib/types";
import { system_border } from "@/lib/functions";

// next imports
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

  const handle_upgrade = (event: SyntheticEvent) => {
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

  // const handle_v3 = (event: SyntheticEvent) => {
  //   event.preventDefault();

  //   fetch(`http://localhost:3000/api/systems/${system._id}`, {
  //     method: "PUT",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name: system.name,
  //       faction: system.faction,
  //       abandoned: system.abandoned,
  //       econDescriptor: system.economy.descriptor,
  //       econState: system.economy.state,
  //       conflict: system.conflict,
  //       exosuit: system.exosuit,
  //       v3: true,
  //       atlas: system.atlas,
  //       blackhole: system.blackhole,
  //     }),
  //   })
  //     .then((api_response) => api_response.json())
  //     .then((response) => {
  //       if (response.error) {
  //         window.alert("There was an error. Check the console for more information");
  //         console.error(response.error);
  //         return;
  //       }

  //       console.log("claimed exosuit upgrade");

  //       if (response.warn) {
  //         window.alert(response.msg);
  //         console.warn("warning");
  //       } else {
  //         console.log("success");
  //       }

  //       router.replace("/systems");
  //     })
  //     .catch((reason) => {
  //       window.alert("There was an error. Check the console for more information");
  //       console.error("error caught in .catch");
  //       console.error("reason:", reason);
  //     });
  // };

  const sys_name = (
    <CenterBox rows>
      {system.name}
      {!system.exosuit && <BoltIcon color="info" sx={{ ml: 0.5 }} />}
      {/* {!system.v3 && <CreditCardIcon color="info" sx={{ ml: 0.5 }} />} */}
    </CenterBox>
  );

  const conflict_text = system.conflict === "Outlaw" ? "Pirate Controlled" : `${system.conflict} Conflict`;

  return (
    <Card sx={system_border(system.atlas, system.blackhole)}>
      <CardHeader title={sys_name} subheader={`${system.faction} // ${system.guild}`} />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {system.economy.type} // {system.economy.strength}
        </Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          {conflict_text}
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
          <IconButton size="small" color="info" onClick={handle_upgrade} sx={{ ml: 0.5 }}>
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
