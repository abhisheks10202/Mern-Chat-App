import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { FaImage, FaVideo } from "react-icons/fa";
import "./styles.css";
import { IconButton, Spinner, useToast, InputGroup, InputLeftElement, Icon, HStack } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import { Flex } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import ChatSetting from "./miscellaneous/ChatSetting";
import { BlockContext } from "../Context/BlockContext";
import Picker from 'emoji-picker-react';
import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperclip, faSmile, faPaperPlane, faPause } from '@fortawesome/free-solid-svg-icons';


// const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
const ENDPOINT = "https://mern-chat-app-1eb8.onrender.com/";


// const socket = io('http://localhost:5000');

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain, messagesForMyChats, setMessagesForMyChats }) => {
  const { isBlocked } = useContext(BlockContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const [loggedUser, setLoggedUser] = useState();


  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [file, setFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // setMessagesForMyChats(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {

    if (event.key === "Enter" && newMessage) {
      const users = selectedChat.users;
      console.log(users);

      // Check if "askchatbot@gmail.com" exists in the users array
      const hasAskChatbotEmail = users.some(user => user.email === "askchatbot@gmail.com");

      if (hasAskChatbotEmail) {
        // Run API when "askchatbot@gmail.com" is found
        // Call your API here
        const loggedUser = JSON.parse(localStorage.getItem("userInfo"))._id;
        const chatId = selectedChat._id;

        console.log("Running API for askchatbot@gmail.com");
        const message = newMessage;

        // console.log("Running other API", user.name);
        // socket.emit("stop typing", selectedChat._id);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          const res = await axios.post('http://localhost:3000/api/chatbot/send-payload', { loggedUser, chatId, message }, config);
          const messages = res.data
          console.log(res.data.message, "   res.data.message");
          console.log(res.data.responseMessage, "   res.data.message");
          console.log(res, "only response")

          messages = res.data.message
          const obj1 = {
            messages: res.data.message
          }
          const obj2 = {
            messages: res.data.responseMessage
          }
          setMessages([...messages, obj1]);
          messages = res.data.responseMessages;
          setMessages([...messages, obj2]);
          console.log(messages, "areyyyy isidbhb=================================================")
          setFetchAgain(!fetchAgain);
          setNewMessage("");


        } catch (error) {
          console.error('Error:', error);
        }
        setNewMessage("");
      }
      else {
        // Run API when "askchatbot@gmail.com" is not found
        // Call your other API here
        // console.log("Running other API", user.name);
        socket.emit("stop typing", selectedChat._id);
        const receiverUserIds = users.filter(user => user._id !== loggedUser._id);
        // console.log(receiverUserIds, loggedUser._id);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };

          setNewMessage("");
          console.log(newMessage);
          const { data } = await axios.post(
            "/api/message",
            {
              content: newMessage,
              chatId: selectedChat,
              // selectedChat:selectedChat,
              receiverUserIds: receiverUserIds
            },
            config
          );
          socket.emit("new message", data);
          setMessages([...messages, data]);
          console.log(data, "else");
          setFetchAgain(!fetchAgain);

          console.log(fetchAgain, "from useEffect singleChat sendMessage");
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }

    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    socket.on("message deleted back", (newMessageRecieved) => {

      setFetchAgain(!fetchAgain);
    });
  });



  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };




  const handleSend = async () => {
    const formData = new FormData();
    formData.append('text', newMessage);
    if (audioBlob) {
      formData.append('file', audioBlob, 'audio.webm');
    }
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch('http://localhost:5000/messages', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setNewMessage('');
    setAudioBlob(null);
    setFile(null);
  };

  const handleEmojiClick = (emojiObject, event) => {
    // if (inputRef.current) {
    //   const cursorPosition = inputRef.current.selectionStart;
    //   const textBeforeCursor = newMessage.substring(0, cursorPosition);
    //   const textAfterCursor = newMessage.substring(cursorPosition);
    //   const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;
    //   setNewMessage(newText);
    // } else {
    //   console.error("inputRef.current is null");
    // }
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
      });

      setRecording(true);
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };
  const handleDocumentClick = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  useEffect((e) => {
    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
    };
  }, []);

  return (
    <>
      {selectedChat ? (
        <>
          {/* <Flex alignItems="center" flexWrap="nowrap"> */}
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>

                  {getSender(user, selectedChat.users)}
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}




                </>
              ))}
            <ChatSetting selectedChat={selectedChat} fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} messages={messages} />
          </Text>
          {/* </Flex> */}


          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="90%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  setMessages={setMessages}
                />

              </div>

            )}

            <Box display="flex" alignItems="center" p={2} borderTop="1px solid #ccc" bg="gray.200" onKeyDown={sendMessage}
            >
              <HStack spacing={2}>
                <IconButton
                  icon={<FontAwesomeIcon icon={faSmile} />}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  aria-label="Emoji Picker"
                  bg="gray.500"
                  color="white"
                  _hover={{bg:"gray.600"}}
                />
                {showEmojiPicker && <div ref={emojiPickerRef} className="emoji-picker-wrapper">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>}

                <IconButton
                  icon={<FontAwesomeIcon icon={faPaperclip} />}
                  as="label"
                  aria-label="File Picker"
                  bg="gray.500"
                  color="white"
                  _hover={{bg:"gray.600"}}
                >
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </IconButton>
              </HStack>
              <Input
                type="text"
                value={newMessage}
                ref={inputRef}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isBlocked ? "You blocked this user" : "Enter a message.."}
                isDisabled={isBlocked}

                flex="1"
                bg="gray.300"
                color="gray"
                ml={2}
                mr={2}
              />
              {newMessage ? (
                <IconButton
                  icon={<FontAwesomeIcon icon={faPaperPlane} />}
                  onClick={handleSend}
                  aria-label="Send Message"
                  bg="blue.500"
                  color="white"
                />
              ) : (
                <IconButton
                  icon={<FontAwesomeIcon icon={recording ? faPause : faMicrophone} />}
                  onClick={recording ? stopRecording : startRecording}
                  aria-label="Record Audio"
                  bg="red.500"
                  color="white"
                  _hover={{bg:"red.600"}}
                />
              )}
            </Box>


          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}

    </>

  );
};

export default SingleChat;