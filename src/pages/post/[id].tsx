import { Box, Heading } from "@chakra-ui/react";
import { EditDeletePostButtons } from "../../components/editDeletePostButtons";
import Layout from "../../components/Layout";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { withApollo } from "../../utils/withApollo";

const Post = ({}) => {
  const { data, loading, error } = useGetPostFromUrl();
  if (loading) {
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
      <Box mb={4}>{data.post.text}</Box>
      <EditDeletePostButtons
        id={data?.post?.id}
        creatorId={data?.post?.creator?.id}
      />
    </Layout>
  );
};
export default withApollo({ ssr: true })(Post);
