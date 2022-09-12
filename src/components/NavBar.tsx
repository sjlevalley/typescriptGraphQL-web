import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import router from "next/router";
import React, { useState, useEffect } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [isServer, setIsServer] = useState(true);
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer,
  });
  let body = null;

  useEffect(() => setIsServer(false), []);

  // data is loading
  if (fetching) {
    body = null;
  } else if (!data?.me) {
    // user not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link href="" mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link href="">Register</Link>
        </NextLink>
      </>
    );
  } else {
    // user logged in
    body = (
      <Flex>
        <Box>{data.me?.username}</Box>
        <Button
          onClick={() => {
            logout({});
            router.push("/login");
          }}
          isLoading={logoutFetching}
          variant="link"
          ml={4}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
export default NavBar;
