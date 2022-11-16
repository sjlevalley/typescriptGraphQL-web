import { useEffect } from "react";
import { ApolloCache } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import gql from "graphql-tag";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useMeQuery,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface VoteSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) {
      const newPoints =
        (data.points as number) + (data.voteStatus === 1 ? -1 : 1);
      cache.writeFragment({
        id: "Post:" + postId,
        fragment: gql`
          fragment __ on Post {
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: null },
      });
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [isServer, setIsServer] = useState(true);
  const [loadingState, setLoadingState] = useState<
    "vote-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation(); // Alternative way to set loading state on upvote and downvote buttons
  const { data, loading } = useMeQuery({
    skip: isServer,
  });

  useEffect(() => setIsServer(false), []);

  console.log("USER", data?.me);

  return (
    <Tooltip label={!data?.me && "Must be Logged in to Vote"}>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        mr={8}
      >
        <IconButton
          disabled={!data?.me}
          onClick={async () => {
            if (post.voteStatus === 1) {
              setLoadingState("vote-loading");
              await vote({
                variables: { postId: post.id, value: 1 },
                update: (cache) => updateAfterVote(1, post.id, cache),
              });
              setLoadingState("not-loading");
              return;
            }
            setLoadingState("vote-loading");
            await vote({
              variables: { postId: post.id, value: 1 },
              update: (cache) => updateAfterVote(1, post.id, cache),
            });
            setLoadingState("not-loading");
          }}
          size={"sm"}
          colorScheme={post.voteStatus === 1 ? "green" : undefined}
          isLoading={loadingState === "vote-loading"}
          icon={<ChevronUpIcon boxSize={8} />}
          aria-label="Upvote"
        />
        {/* </Tooltip> */}
        {post.points}
        {/* <Tooltip label={!data?.me && "Must be Logged in to Vote"}> */}
        <IconButton
          disabled={!data?.me}
          onClick={async () => {
            if (post.voteStatus === -1) {
              setLoadingState("downdoot-loading");
              await vote({
                variables: { postId: post.id, value: -1 },
                update: (cache) => updateAfterVote(-1, post.id, cache),
              });
              setLoadingState("not-loading");
              return;
            }
            setLoadingState("downdoot-loading");
            await vote({
              variables: { postId: post.id, value: -1 },
              update: (cache) => updateAfterVote(-1, post.id, cache),
            });
            setLoadingState("not-loading");
          }}
          size={"sm"}
          colorScheme={post.voteStatus === -1 ? "red" : undefined}
          isLoading={loadingState === "downdoot-loading"}
          icon={<ChevronDownIcon boxSize={8} />}
          aria-label="Downvote"
        />
      </Flex>
    </Tooltip>
  );
};

export default VoteSection;
