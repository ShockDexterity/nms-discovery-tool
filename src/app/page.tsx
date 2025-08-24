import { Box, Button } from "@mui/material";

export default function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ pb: 2, my: 2, borderBottom: 1, borderColor: "divider" }}
    >
      <Button href="/planets">Planets</Button>

      <Button href="/systems">Systems</Button>
    </Box>
  );
}
