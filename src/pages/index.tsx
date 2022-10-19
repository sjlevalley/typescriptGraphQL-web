import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { EditDeletePostButtons } from "../components/editDeletePostButtons";
import Layout from "../components/Layout";
import UpdootSection from "../components/UpdootSection";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, loading, error, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  const { data: loggedInUser } = useMeQuery();

  if (!data && !loading) {
    return (
      <div>
        <div>Oops! A problem occurred while fetching data.</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      {loading && !data ? (
        <div>Loading Data...</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href={"/post/[id]"} as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="lg">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted By: {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    {loggedInUser?.me?.id === p.creator.id && (
                      <Box ml="auto">
                        <EditDeletePostButtons
                          id={p?.id}
                          creatorId={p?.creator?.id}
                        />
                      </Box>
                    )}
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex>
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              })
            }
            isLoading={loading}
            m="auto"
            my={8}
          >
            Load More
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
