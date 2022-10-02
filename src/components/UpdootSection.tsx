import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment, PostsQuery } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton icon={<ChevronUpIcon boxSize={8} />} aria-label="Upvote" />

      {post.points}
      <IconButton
        icon={<ChevronDownIcon boxSize={8} />}
        aria-label="Downvote"
      />
    </Flex>
  );
};
export default UpdootSection;
