import NavBar from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <br />
      {!data ? (
        <div>Loading Data...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
