import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
// import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  console.log("ROUTER", router);
  const [isServer, setIsServer] = useState(true);
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer,
  });
  let body = null;

  useEffect(() => setIsServer(false), []);

  // data is loading
  if (loading) {
    body = null;
  } else if (!data?.me) {
    // user not logged in
    body = (
      <>
        {router.pathname !== "/login" && (
          <NextLink href="/login">
            <Link href="" mr={4}>
              Login
            </Link>
          </NextLink>
        )}
        {router.pathname !== "/register" && (
          <NextLink href="/register">
            <Link href="">Register</Link>
          </NextLink>
        )}
      </>
    );
  } else {
    // user logged in
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button size="sm" as={Link} mr={4}>
            Create Post
          </Button>
        </NextLink>
        <Button
          onClick={async () => {
            await logout({});
            await apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
          variant="link"
          mr={4}
        >
          Logout
        </Button>
        <NextLink href="/">
          <Link>
            <Box>{data.me?.username}</Box>
          </Link>
        </NextLink>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} margin="auto" align="center" maxW={1000}>
        <NextLink href="/">
          <Link>
            <Heading size="lg">Reddit-ish</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
export default NavBar;
