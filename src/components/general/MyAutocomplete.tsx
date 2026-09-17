// mui component imports
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type Props = Readonly<{
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}>;

export default function MyAutocomplete({ label, name, options, defaultValue = undefined }: Props) {
  if (defaultValue && !defaultValue.includes("/")) {
    // if there is a default value, define it
    return (
      <Autocomplete
        clearOnEscape
        options={options}
        defaultValue={defaultValue}
        renderInput={(params) => <TextField {...params} label={label} name={name} size="small" required />}
      />
    );
  } else {
    // if there is no default value, don't give Autocomplete anything about it
    return (
      <Autocomplete
        clearOnEscape
        options={options}
        renderInput={(params) => <TextField {...params} label={label} name={name} size="small" required />}
      />
    );
  }
}
