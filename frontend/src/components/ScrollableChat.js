import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import DeleteMessageModal from "./miscellaneous/DeleteMessageModal";
import ScrollableFeed from "react-scrollable-feed";
// import { Button } from "@chakra-ui/button";
import moment from "moment";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";
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
  deletedFor
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";


const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const [showModal, setShowModal] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const toast = useToast();

  const openModal = (messageId) => {
    setMessageId(messageId);
    setShowModal(true);
  };

  const closeModal = () => {
    setMessageId(null);
    setShowModal(false);
  };
  const handleDeleteForMe = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.delete(
        `/api/message/${messageId}/delete-for-me`,
        config
      );
      // Handle the response data as needed
      console.log(response.data);
      closeModal();
      // Show success toast message
      toast({
        title: "Message Deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error(error);
      // Handle any errors that occur during the request
      // Show error toast message
      toast({
        title: "Error",
        description: "An error occurred while deleting the message.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  

  const handleDeleteForEveryone = async() => {
    // Call the API for deleting the message for everyone
    // ...
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.delete(
        `/api/message/${messageId}/delete-for-everyone`,
        config
      );
      // Handle the response data as needed
      console.log(response.data);
      closeModal();
      // Show success toast message
      toast({
        title: "Message Deleted for everyone",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error(error);
      // Handle any errors that occur during the request
      // Show error toast message
      toast({
        title: "Error",
        description: "An error occurred while deleting the message.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    closeModal();
  };
  console.log("scroll", user);

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
              isLastMessage(messages, i, user._id)) &&
              deletedFor(messages, m, i, user._id) && (
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
            {deletedFor(messages, m, i, user._id) && (
              <span
                style={{
                  backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  color: m.deletedForEveryone ? "gray" : "inherit",
                  fontStyle: m.deletedForEveryone ? "italic" : "normal",
                  background: m.deletedForEveryone ? "black" : `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                }}
              >{m.deletedForEveryone ? <DeleteIcon boxSize={4} mr={1} /> : <></>}
                {m.content}
                {m.deletedForEveryone === false ? <Tooltip label="Delete Message" fontSize="md">
                  <ChevronDownIcon onClick={() => openModal(m._id)} cursor="pointer" />
                </Tooltip> : <></>}

                <Text fontSize="xs" color="gray.500">
                  {moment(m.createdAt).format("hh:mm A")}
                </Text>
              </span>
            )}
          </div>
        ))}

      <Modal isOpen={showModal} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this message?
          </ModalBody>
          <ModalFooter>
          <Button colorScheme="red" size="sm" mr={3} ml={1} onClick={handleDeleteForMe}>
        Delete for Me
      </Button>
      <Button colorScheme="red" size="sm" mr={3} onClick={handleDeleteForEveryone}>
        Delete for Everyone
      </Button>
            <Button variant="ghost" size="sm" onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollableFeed>

  );
};

export default ScrollableChat;
