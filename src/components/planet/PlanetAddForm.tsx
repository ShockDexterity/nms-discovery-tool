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
  Autocomplete,
} from "@mui/material";

import CenterBox from "@/components/general/CenterBox";
import FormBox from "@/components/general/FormBox";
import MyAutocomplete from "@/components/general/MyAutocomplete";
import SystemAutocomplete from "@/components/system/SystemAutocomplete";

import { biome_descriptors } from "@/lib/lists";
import { biomeDescriptorMap, resources } from "@/lib/maps";

import { useRouter } from "next/navigation";

export default function PlanetAddForm() {
  const SentinelLabelId = React.useId();

  const [baseVal, setBaseVal] = React.useState<boolean>(false);

  const router = useRouter();

  const handle_submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    const form_data = Object.fromEntries(new FormData(form).entries());

    console.log(form_data);

    try {
      const response = await fetch("http://localhost:3000/api/planets", {
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

      router.push("/planets");
    } catch (error: any) {
      window.alert("There was an error. Check the console for more information");
      console.error(error);
    }
  };

  const biome_sorter = (a: string, b: string) => {
    if (!biomeDescriptorMap[a] && !biomeDescriptorMap[b]) {
      return 0;
    } else if (!biomeDescriptorMap[a]) {
      return "[Inconsistent]".localeCompare(biomeDescriptorMap[b]);
    } else if (!biomeDescriptorMap[b]) {
      return biomeDescriptorMap[a].localeCompare("[Inconsistent]");
    } else {
      return biomeDescriptorMap[a].localeCompare(biomeDescriptorMap[b]);
    }
  };

  return (
    <CenterBox>
      <Paper sx={{ py: 2, width: "50%" }}>
        <form onSubmit={handle_submit}>
          <CenterBox>
            <FormLabel>Basic Info</FormLabel>

            <FormBox>
              <TextField label="Planet Name" name="name" size="small" required />
            </FormBox>

            <React.Suspense fallback={<CircularProgress size={56} />}>
              <FormBox>
                <SystemAutocomplete system_list_promise={get_systems()} />
              </FormBox>
            </React.Suspense>

            <FormBox>
              <Autocomplete
                clearOnEscape
                options={biome_descriptors.sort((a, b) => biome_sorter(a, b))}
                groupBy={(option) => (biomeDescriptorMap[option] ? biomeDescriptorMap[option] : "[Inconsistent]")}
                renderInput={(params) => (
                  <TextField {...params} label="Planet Descriptor" name="descriptor" size="small" required />
                )}
              />
            </FormBox>

            <FormBox>
              <FormControlLabel label="Moon" control={<Checkbox name="moon" />} />
            </FormBox>

            <Divider sx={{ my: 1, width: "50%" }} />

            <FormLabel>Resources</FormLabel>

            <FormBox>
              <MyAutocomplete label="Agricultural Resource" name="agricultural" options={resources.agricultural} />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Stellar Metal" name="stellar" options={resources.stellar} defaultValue="Copper" />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Local Resource" name="local" options={resources.local} />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="General Resource" name="general" options={resources.general} />
            </FormBox>

            <Divider sx={{ my: 0.5, width: "50%" }} />

            <FormBox>
              <FormLabel id={SentinelLabelId}>Sentinel Presence</FormLabel>
            </FormBox>
            <FormBox>
              <RadioGroup row defaultValue="low" name="sentinels" aria-labelledby={SentinelLabelId}>
                <FormControlLabel label="Low" value="low" control={<Radio />} />
                <FormControlLabel label="High" value="high" control={<Radio />} />
                <FormControlLabel label="Aggressive" value="aggressive" control={<Radio />} />
                <FormControlLabel label="Corrupt" value="corrupt" control={<Radio />} />
              </RadioGroup>
            </FormBox>

            <Divider sx={{ my: 0.5, width: "50%" }} />

            <FormBox>
              <FormLabel>Base Presence</FormLabel>
            </FormBox>
            <FormBox>
              <FormControlLabel
                label="Has Base"
                control={
                  <Checkbox name="base" checked={baseVal} onChange={(event) => setBaseVal(event.target.checked)} />
                }
              />
              {baseVal && <TextField label="Base Name" name="base_name" size="small"></TextField>}
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

async function get_systems() {
  return fetch("http://localhost:3000/api/systems").then((resp) => resp.json());
}
