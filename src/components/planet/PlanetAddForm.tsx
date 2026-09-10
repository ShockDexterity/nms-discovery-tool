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

import { biome_descriptors, exotic_biomes } from "@/lib/lists";
import {
  biomeAgriculturalResourceMap,
  biomeDescriptorMap,
  biomeWeatherMap,
  resourceBiomeMap,
  resources,
  specialDescriptorMap,
} from "@/lib/maps";

import { useRouter } from "next/navigation";

export default function PlanetAddForm() {
  const [descriptor, setDescriptor] = React.useState<string>("");

  const [baseVal, setBaseVal] = React.useState<boolean>(false);

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

  const agriculture_options = resources.agricultural.filter((value) => {
    if (descriptor === "") {
      return true;
    }

    const biome = biomeDescriptorMap[descriptor];

    if (exotic_biomes.includes(biome)) {
      return value === "None";
    }

    if (biome) {
      return biomeAgriculturalResourceMap[biome] === value;
    }

    let possible = false;
    for (let b of specialDescriptorMap[descriptor]) {
      if (biomeAgriculturalResourceMap[b] === value) {
        possible = true;
        break;
      }
    }

    if (!possible && descriptor === "Tropical") {
      if (value === "None") possible = true;
    }

    return possible;
  });

  const local_options = resources.local.filter((value) => {
    if (descriptor === "") {
      return true;
    }

    const biome = biomeDescriptorMap[descriptor];

    if (biome) {
      return resourceBiomeMap[value].includes(biome);
    }

    let possible = false;
    for (let b of specialDescriptorMap[descriptor]) {
      if (resourceBiomeMap[value].includes(b)) {
        possible = true;
        break;
      }
    }

    return possible;
  });

  const SentinelLabelId = React.useId();

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

                value={descriptor}
                onChange={(event, value) => setDescriptor(value ?? "")}

                renderInput={(params) => (
                  <TextField {...params} label="Planet Descriptor" name="descriptor" size="small" required />
                )}
              />
            </FormBox>

            {descriptor === "Tropical" && (
              <FormBox>
                <Autocomplete
                  clearOnEscape
                  options={biomeWeatherMap.lush.concat(biomeWeatherMap.marsh).concat(["Humid"])}
                  groupBy={(option) =>
                    option === "Humid" ? "Both" : biomeWeatherMap.lush.includes(option) ? "Lush" : "Marsh"
                  }

                  renderInput={(params) => (
                    <TextField {...params} label="Weather Descriptor" name="weather" size="small" required />
                  )}
                />
              </FormBox>
            )}

            <FormBox>
              <FormControlLabel label="Moon" control={<Checkbox name="moon" />} />
            </FormBox>

            <Divider sx={{ my: 1, width: "50%" }} />

            <FormLabel>Resources</FormLabel>

            <FormBox>
              <MyAutocomplete label="Agricultural Resource" name="agricultural" options={agriculture_options} />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Stellar Metal" name="stellar" options={resources.stellar} defaultValue="Copper" />
            </FormBox>

            <FormBox>
              <MyAutocomplete label="Local Resource" name="local" options={local_options} />
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
              {baseVal && <TextField label="Base Name" name="base_name" size="small" required={baseVal} />}
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
