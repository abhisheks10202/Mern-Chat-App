// src/theme.js

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#ecefff",
      // Define more shades of your brand color here
      500: "#667eea",
      // ...
    },
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif",
    // Add more custom fonts if needed
  },
  components: {
    Button: {
      // Change default props or add variants for Button component
      baseStyle: {
        fontWeight: "bold",
      },
      sizes: {
        md: {
          fontSize: "18px",
          px: "24px",
          py: "12px",
        },
      },
    },
    // Add configurations for other Chakra UI components as needed
  },
});

export default theme;
