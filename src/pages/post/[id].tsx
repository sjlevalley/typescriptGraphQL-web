import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import Layout from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/react";

const Post = ({}) => {
  const router = useRouter();
  const intId = typeof router.query.id === "string" ? +router.query.id : -1;
  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return <Layout>Loading Post...</Layout>;
  }
  if (error) {
    return (
      <Layout>
        <Box>{error.message}</Box>
      </Layout>
    );
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box>Post not found</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <Heading>{data.post.title}</Heading>
      {data.post.text}
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
