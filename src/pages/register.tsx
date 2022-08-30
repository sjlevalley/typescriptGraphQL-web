import React from "react";
import { Formik, Form } from "formik";
import {
  Box,
  Button,
  FormControl,
  //   FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/inputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [{}, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          //const response = await register({ username: values.username, password: values.password });
          const response = await register(values);
          if (response.data?.register.errors) {
            // setErrors({
            //   username: "Hey, I'm an error",
            // });
            setErrors(toErrorMap(response.data?.register.errors));
          } else if (response.data?.register.user) {
            // Should now be registered and have cookie showing in browser. Now navigate to next page
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              //   color=''
              isLoading={isSubmitting}
              //   backgroundColor="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
