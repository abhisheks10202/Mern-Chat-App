import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import DeleteMessageModal from "./miscellaneous/DeleteMessageModal";
import ScrollableFeed from "react-scrollable-feed";
import { Button } from "@chakra-ui/button";
import moment from "moment";
import { VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Box,
  IconButton,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { ChevronDownIcon } from "@chakra-ui/icons";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    const currentDate = moment(currentMessage.createdAt).format("YYYY-MM-DD");
    const previousDate = moment(previousMessage.createdAt).format("YYYY-MM-DD");
    return currentDate !== previousDate;
  };
  const backgroundImageUrl =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,

                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
              <Tooltip label="Phone number" fontSize="md">
                <ChevronDownIcon />
              </Tooltip>
              <Text fontSize="xs" color="gray.500">
                {moment(m.createdAt).format("hh:mm A")}
              </Text>
            </span>
          </div>
        ))}
      {}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
