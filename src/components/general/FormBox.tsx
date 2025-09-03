import { Box } from "@mui/material";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function FormBox({ children }: Props) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ "& .MuiTextField-root": { m: 1, width: "26ch" }, flexWrap: "wrap" }}
    >
      {children}
    </Box>
  );
}
