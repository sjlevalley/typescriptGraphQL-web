import React, { useState } from "react";
import { Flex, Button, Box, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import NextLink from "next/link";
import { InputField } from "../components/inputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

export const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          //const response = await register({ username: values.username, password: values.password });
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              A link to reset your password as been sent to the email that was
              entered. The link will expire after 24 hours.
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="Enter email"
                label="Email"
                type="email"
              />
              <Flex>
                <NextLink href="/forgot-password">
                  <Link ml="auto" mt={2}>
                    Forgot Password?
                  </Link>
                </NextLink>
              </Flex>
              <Button mt={4} type="submit" isLoading={isSubmitting}>
                Reset Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};
export default withApollo({ ssr: false })(ForgotPassword);
