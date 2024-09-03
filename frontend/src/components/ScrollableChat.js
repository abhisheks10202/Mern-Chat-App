import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import DeleteMessageModal from "./miscellaneous/DeleteMessageModal";
import ScrollableFeed from "react-scrollable-feed";
import AudioMessage from '../components/miscellaneous/AudioMessage'
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
  deletedFor,
  canDeleteForEveryone
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import io from "socket.io-client";




const ScrollableChat = ({ messages, fetchAgain, setFetchAgain, setMessages }) => {
  var socket, selectedChatCompare;
  const { user } = ChatState();
  const [showModal, setShowModal] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [isSameSenderr, setIsSameSenderr] = useState(false);
  const [deletedSocket, setDeletedSocket] = useState(null);

  const toast = useToast();

  const openModal = (m, userId, messageId) => {
    setIsSameSenderr(canDeleteForEveryone(m, userId, messageId));
    console.log(isSameSenderr);
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

      const updatedMessages = messages.filter((message) => message._id !== messageId);
      // setFetchAgain(!fetchAgain);
      setMessages(updatedMessages);
      setFetchAgain(!fetchAgain);

      // socket.emit("deleted message", response);
      // Handle the response data as needed
      console.log(response.data, "after deleted emit");
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
      console.log(error.response, "in catch errrorrror")
      const errorMessage = error.response.data.error;
      console.error(error);
      // Handle any errors that occur during the request
      // Show error toast message
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };


  const handleDeleteForEveryone = async () => {
    // Call the API for deleting the message for everyone
    // ...
    const response = ""
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



      const updatedMessages = messages.map((message) =>
        message._id === messageId
          ? { ...message, content: "Deleted for everyone", MessageDeletedForEveryone: true }
          : message
      );
      setMessages(updatedMessages);
      setFetchAgain(!fetchAgain);
      toast({
        title: "Message Deleted for everyone",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      const errorMessage = error.response.data.error;
      console.error(error);
      // Handle any errors that occur during the request
      // Show error toast message
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    closeModal();
  };

  useEffect(() => {
    console.log(messages, "messages")
  }, [fetchAgain]);


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
          <div style={{ display: "flex" }} key={m._id} >
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
                  color: m.MessageDeletedForEveryone ? "gray" : "inherit",
                  fontStyle: m.MessageDeletedForEveryone ? "italic" : "normal",
                  background: m.MessageDeletedForEveryone ? "black" : `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {m.MessageDeletedForEveryone ? <DeleteIcon boxSize={4} mr={1} /> : <></>}

                  {m.audioUrl ? (
                    <AudioMessage audioUrl={m.audioUrl} />
                  ) : (
                    <Text fontSize="md" style={{ flex: 1 }}>
                      {m.content}
                    </Text>
                  )}
                  {/* Tooltip for deleting message */}
                  {m.MessageDeletedForEveryone === false && (
                    <Tooltip label="Delete Message" fontSize="md">
                      <ChevronDownIcon onClick={() => openModal(m, user._id, m._id)} cursor="pointer" />
                    </Tooltip>
                  )}
                </div>
                <Text fontSize="xs" color="gray.500" style={{ marginTop: "5px" }}>
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
            <Button colorScheme="red" size={isSameSenderr ? "sm" : "md"} // Set size based on isSameSenderr
              ml={1}
              mr={isSameSenderr ? 1 : 5} onClick={handleDeleteForMe}>
              Delete for Me
            </Button>
            {isSameSenderr === true ? <Button colorScheme="red" size="sm" mr={3} onClick={handleDeleteForEveryone}>
              Delete for Everyone
            </Button> : <></>}

            <Button variant="ghost" size={isSameSenderr ? "sm" : "md"} // Set size based on isSameSenderr
              ml={1}
              mr={isSameSenderr ? 1 : 5} onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollableFeed>


  );
};

export default ScrollableChat;