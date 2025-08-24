"use client";
import { Fira_Sans } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const fira = Fira_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  defaultColorScheme: "dark",
  cssVariables: {
    colorSchemeSelector: "class",
  },
  typography: {
    fontFamily: fira.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: "info" },
              style: {
                backgroundColor: "#60a5fa",
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;
