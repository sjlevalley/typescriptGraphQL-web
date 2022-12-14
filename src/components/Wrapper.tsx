import { Box } from "@chakra-ui/layout";
import React from "react";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  children: JSX.Element;
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "1000px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
