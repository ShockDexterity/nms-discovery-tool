"use client";

// mui component imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

// next imports
import { usePathname } from "next/navigation";

type Props = Readonly<{
  title: string;
  subtitle?: string;
}>;

export default function Header({ title, subtitle = "" }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: 2,
        my: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
        <Link color="inherit" underline="none" href="/">
          {title}
        </Link>
      </Typography>

      {subtitle && <Typography variant="subtitle2">{subtitle}</Typography>}
      {usePathname() !== "/" && (
        <ButtonGroup>
          <Button href="/planets">Planets</Button> <Button href="/systems">Systems</Button>
        </ButtonGroup>
      )}
    </Box>
  );
}
