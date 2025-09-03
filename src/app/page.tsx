import CenterBox from "@/components/general/CenterBox";
import { Button, Divider } from "@mui/material";

export default function Home() {
  return (
    <CenterBox>
      <Button href="/planets" variant="outlined" sx={{ my: 1 }}>
        Planets
      </Button>
      <Button href="/systems" variant="outlined" sx={{ my: 1 }}>
        Systems
      </Button>

      <Divider sx={{ my: 2, width: "100%" }} />
    </CenterBox>
  );
}
