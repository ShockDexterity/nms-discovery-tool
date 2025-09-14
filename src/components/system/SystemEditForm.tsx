"use client";
import React, { FormEvent } from "react";

import {
  FormLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  RadioGroup,
  Radio,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";

import CenterBox from "@/components/general/CenterBox";
import FormBox from "@/components/general/FormBox";
import MyAutocomplete from "@/components/general/MyAutocomplete";
import SystemAutocomplete from "@/components/system/SystemAutocomplete";

import { biome_descriptors, conflict_levels, factions } from "@/lib/lists";
import { economy, resources } from "@/lib/maps";
import { System } from "@/lib/types";

import { useRouter } from "next/navigation";

type Props = {
  system_promise: Promise<System>;
};

export default function SystemEditForm({ system_promise }: Props) {
  const system = React.use(system_promise);

  const router = useRouter();

  const handle_submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    const form_data = Object.fromEntries(new FormData(form).entries());

    console.log(form_data);

    try {
      const response = await fetch(`http://localhost:3000/api/systems/${system._id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form_data),
      })
        .then((resp) => resp.json())
        .catch((reason) => {
          console.log("caught in .catch");
          throw Error(reason);
        });

      if (response.error) {
        window.alert("There was an error. Check the console for more information");
        console.error(response.error);
        return;
      }

      if (response.warn) {
        window.alert(response.msg);
        console.warn("warning");
      } else {
        console.log("success");
      }

      router.push("/systems");
    } catch (error: any) {
      window.alert("There was an error. Check the console for more information");
      console.error(error);
    }
  };

  return (
    <CenterBox>
      <Paper sx={{ py: 2, width: "50%" }}>
        <form onSubmit={handle_submit}>
          <CenterBox>
            <FormLabel>Basic Info</FormLabel>

            <FormBox>
              <TextField label="System Name" name="name" size="small" defaultValue={system.name ?? ""} required />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Faction" name="faction" options={factions} defaultValue={system.faction ?? ""} />
            </FormBox>

            <FormBox>
              <MyAutocomplete
                label="Conflict Level"
                name="conflict"
                options={conflict_levels}
                defaultValue={system.conflict}
              />
            </FormBox>

            <FormBox>
              <FormControlLabel
                label="Abandoned"
                control={<Checkbox name="abandoned" defaultChecked={system.abandoned ?? false} />}
              />
            </FormBox>

            <Divider sx={{ my: 1, width: "50%" }} />

            <FormLabel>Economy</FormLabel>

            <FormBox>
              <MyAutocomplete
                label="Economy Descriptor"
                name="econDescriptor"
                options={economy.descriptors}
                defaultValue={system.economy.descriptor ?? ""}
              />
            </FormBox>

            <FormBox>
              <MyAutocomplete
                label="Economy State"
                name="econState"
                options={economy.states}
                defaultValue={system.economy.state ?? ""}
              />
            </FormBox>

            <Divider sx={{ my: 0.5, width: "50%" }} />

            <FormBox>
              <FormControlLabel
                label="Atlas System"
                control={<Checkbox name="atlas" defaultChecked={system.atlas ?? false} />}
              />

              <FormControlLabel
                label="Black Hole"
                control={<Checkbox name="blackhole" />}
                defaultChecked={system.blackhole ?? false}
              />
            </FormBox>

            <Divider sx={{ my: 0.5, width: "50%" }} />

            <FormBox>
              <FormControlLabel
                label="Exosuit Claimed"
                control={<Checkbox name="exosuit" defaultChecked={system.exosuit ?? false} />}
              />

              <FormControlLabel
                label="AtlasPass v3 Claimed"
                control={<Checkbox name="v3" defaultChecked={system.v3 ?? false} />}
              />
            </FormBox>

            <Button type="submit" variant="outlined" sx={{ mt: 2 }}>
              Submit
            </Button>
          </CenterBox>
        </form>
      </Paper>
    </CenterBox>
  );
}
