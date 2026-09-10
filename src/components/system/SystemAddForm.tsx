"use client";
import React, { FormEvent } from "react";

import { FormLabel, TextField, FormControlLabel, Checkbox, Divider, Button, Paper } from "@mui/material";

import CenterBox from "@/components/general/CenterBox";
import FormBox from "@/components/general/FormBox";
import MyAutocomplete from "@/components/general/MyAutocomplete";

import { conflict_levels, factions, guilds } from "@/lib/lists";
import { economy } from "@/lib/maps";

import { useRouter } from "next/navigation";

export default function SystemAddForm() {
  const router = useRouter();

  const handle_submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    const form_data = Object.fromEntries(new FormData(form).entries());

    console.log(form_data);

    try {
      const response = await fetch("http://localhost:3000/api/systems", {
        method: "POST",
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
              <TextField label="System Name" name="name" size="small" required />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Faction" name="faction" options={factions} />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Guild" name="guild" options={guilds} />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Conflict Level" name="conflict" options={conflict_levels} />
            </FormBox>

            <FormBox>
              <FormControlLabel label="Abandoned" control={<Checkbox name="abandoned" />} />
            </FormBox>

            <Divider sx={{ my: 1, width: "50%" }} />

            <FormLabel>Economy</FormLabel>

            <FormBox>
              <MyAutocomplete label="Economy Descriptor" name="econDescriptor" options={economy.descriptors} />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Economy State" name="econState" options={economy.states} />
            </FormBox>

            <Divider sx={{ my: 0.5, width: "50%" }} />

            <FormBox>
              <FormControlLabel label="Atlas System" control={<Checkbox name="atlas" />} />
              <FormControlLabel label="Black Hole" control={<Checkbox name="blackhole" />} />
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
