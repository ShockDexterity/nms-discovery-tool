import { Box, Button, ButtonGroup, /* Breadcrumbs, */ Link, Typography } from "@mui/material";

type Props = Readonly<{
  title: string;
  subtitle?: string;
}>;

export default function Header({ title, subtitle = "" }: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ pb: 2, my: 2, borderBottom: 1, borderColor: "divider" }}
    >
      <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
        <Link color="inherit" underline="none" href="/">
          {title}
        </Link>
      </Typography>

      {subtitle && <Typography variant="subtitle2">{subtitle}</Typography>}

      <ButtonGroup>
        <Button href="/planets">Planets</Button> <Button href="/systems">Systems</Button>
      </ButtonGroup>
    </Box>
  );
}
