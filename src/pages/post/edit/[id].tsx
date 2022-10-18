import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { InputField } from "../../../components/inputField";
import Layout from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useGetIntId } from "../../../utils/useGetIntId";
import { withApollo } from "../../../utils/withApollo";

export const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading, error } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
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
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values, { setErrors }) => {
          await updatePost({ variables: { id: intId, ...values } });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Enter a title"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                label="Body"
                name="text"
                placeholder="Enter text here..."
                textarea
              />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting}>
              Edit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
export default withApollo({ ssr: false })(EditPost);
