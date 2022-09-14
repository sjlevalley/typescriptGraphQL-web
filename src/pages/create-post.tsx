import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/inputField";
import Layout from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await createPost({ input: values });
          if (error) {
          }
          router.push("/");
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
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
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient)(CreatePost);
