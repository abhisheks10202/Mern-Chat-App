import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState,useRef } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone,faVideo,faImage, faPaperclip, faSmile, faPaperPlane, faPause } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import ChatBot from "./ChatBot";
import moment from "moment";

import {
  deletedFor
} from "../config/ChatLogics";


const today = moment().startOf('day');

const MyChats = ({ fetchAgain, messagesForMyChats }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const selectedChatRef = useRef(null); // Use a ref for selectedChat
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data, "filetereded", user.name);
      const filteredChats = data.filter(chat => !chat.chatNotVisibleTo.includes(user._id));
      // setTimeout(() => {
      //   console.log(filteredChats);
      //   // Continue with further processing here
      // }, 2000);
      // console.log(filteredChats," yeh hai filtered Chat")
      // setChats(data);
      setChats(filteredChats);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleChatSelect = (chat) => {
    selectedChatRef.current = chat; // Update the ref
    // You might want to use selectedChatRef's value elsewhere if needed
    // If you still want to set the global state here, you can do it.
    console.log("hellll")
    setSelectedChat(chat);
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    console.log(fetchAgain, "from useEffect MyCHats");
    // console.log(messagesForMyChats," message for my chats");
    // console.log(user.name)
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}

          >
            New Group Chat
          </Button>

        </GroupChatModal>
      </Box>
      <ChatBot />

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="83%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (

              <Box
                // onClick={() => setSelectedChat(chat)}
                onClick={() => handleChatSelect(chat)}
                cursor="pointer"
                // bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                // color={selectedChat === chat ? "white" : "black"}
                bg={selectedChatRef.current && selectedChatRef.current._id === chat._id ? "#38B2AC" : "#E8E8E8"} // Highlight if selected
                color={selectedChatRef.current && selectedChatRef.current._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName.charAt(0).toUpperCase() + chat.chatName.slice(1).toLowerCase()}
                </Text>

                {chat.latestMessage && (

                  <Text fontSize="xs" display="flex" justifyContent="space-between">
                    <div>
                      <b>{chat.latestMessage.sender.name.charAt(0).toUpperCase() + chat.latestMessage.sender.name.slice(1)} : </b>

                      {
                        chat.latestMessage.MessageDeletedFor.includes(user._id)
                          ? "You deleted this message"
                          : chat.latestMessage.imageUrls && chat.latestMessage.imageUrls.length > 0
                            ? <span>
                            <FontAwesomeIcon icon={faImage}style={{ marginRight: '5px' }} />
                            <span>Image</span>
                          </span>
                            : chat.latestMessage.videoUrls && chat.latestMessage.videoUrls.length > 0
                              ? <span>
                              <FontAwesomeIcon icon={faVideo}style={{ marginRight: '5px' }} />
                              <span>Video</span>
                            </span>
                              : chat.latestMessage.audioUrl && chat.latestMessage.audioUrl.length > 0
                                ?
                                <span>
                                  <FontAwesomeIcon icon={faMicrophone} style={{ marginRight: '5px' }} />
                                  <span>Audio</span>
                                </span>

                                : chat.latestMessage.content
                                  ? chat.latestMessage.content.length > 50
                                    ? chat.latestMessage.content.substring(0, 51) + "..."
                                    : chat.latestMessage.content
                                  : null // You can display a fallback message here
                      }


                    </div>
                    <div style={{ whiteSpace: "nowrap" }}>
                      {moment(chat.latestMessage.createdAt).isSame(today, 'day')
                        ? moment(chat.latestMessage.createdAt).format('hh:mm A')
                        : moment(chat.latestMessage.createdAt).isSame(today.clone().subtract(1, 'day'), 'day')
                          ? "Yesterday"
                          : moment(chat.latestMessage.createdAt).format('DD/MM/YY')
                      }
                      {/* {console.log(chat.latestMessage.createdAt)} */}

                    </div>

                  </Text>

                )}
              </Box>


            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
