import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import { FaImage, FaPauseCircle,faPhone } from "react-icons/fa";
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

import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WaveSurfer from 'wavesurfer.js';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faMicrophone, faPaperclip, faSmile, faPaperPlane, faPause } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from "./miscellaneous/EmojiPicker";
import FilePicker from "./miscellaneous/FilePicker";
import ImageMessage from "./miscellaneous/ImageMessage";
import CallComponent from "./miscellaneous/AudioCall";
import AudioCallComponent from "./miscellaneous/AudioCall"
import VideoCallComponent from "./miscellaneous/VideoCall"
import { FaPhone, FaVideo } from 'react-icons/fa';

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
  const [file, setFile] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveform, setWaveform] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const inputRef = useRef();
  const timerRef = useRef(null);




const [receiverUser, setReceiverUser] = useState();

const [currentCall, setCurrentCall] = useState(null);

const contactName = 'Jane Doe'; // Example contact name
const contactImage = 'https://via.placeholder.com/150'; // Example contact image
const startAudioCall = () => {
  setCurrentCall('audio');
};
const startVideoCall = () => {
  setCurrentCall('video');
};
const hangUp = () => {
  setCurrentCall(null);
};



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

  let receiverUserIds = [];

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
      receiverUserIds = users.filter(user => user._id !== loggedUser._id);
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
  // const users = selectedChat.users;
  // receiverUserIds = selectedChat.users.filter(user => user._id !== loggedUser._id);
  // setReceiverUser(receiverUserIds[0]);
  // console.log(receiverUser+" receiverUser")
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




const handleSend = async (event) => {
  console.log("audio file")

  const formData = new FormData();
  const users = selectedChat.users;
  receiverUserIds = users.filter(user => user._id !== loggedUser._id);

  // If the user enters a text message
  if (newMessage) {
    formData.append('content', newMessage); // Append text message
  }
  setNewMessage("");
  // If the user recorded audio
  if (file) {
    formData.append('file', file); // Add the file to formData
    setFile(null); // Reset file after sending
  }
  if (audioBlob) {
    formData.append('audio', audioBlob, 'audio.webm');  // File upload
    console.log(audioBlob)

  }

  if (waveform) {
    waveform.empty();
  }
  setAudioBlob(null);

  formData.append('chatId', selectedChat._id);  // Assuming chatId is defined in your scope

  if (Array.isArray(receiverUserIds) && receiverUserIds.length > 0) {
    console.log('receiverUserIds:', receiverUserIds);
    receiverUserIds.forEach(user => {
      if (user._id) {
        formData.append('receiverUserIds[]', user._id); // Append each user's _id
      } else {
        console.error('User object does not have an _id:', user);
      }
    });
  } else {
    console.error('receiverUserIds is not a valid array');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    const response = await fetch('api/message', {
      method: 'POST',
      body: formData,
      ...config, // Spread operator to include headers
    });



    console.log(fetchAgain, "from useEffect singleChat sendMessage");
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error sending message:', errorResponse);
      return;
    }

    const data = await response.json();
    console.log('Message sent successfully:', data);
    console.log(data);
    setFile(null);
    socket.emit("new message", data);
    setMessages([...messages, data]);
    console.log(data, "else");
    setFetchAgain(!fetchAgain);

    // Further handle state resets...
  } catch (error) {
    console.error('Error:', error);
  }
};

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorderRef.current = mediaRecorder;
  audioChunksRef.current = [];
  mediaRecorder.start();
  mediaRecorder.addEventListener('dataavailable', (event) => {
    audioChunksRef.current.push(event.data);
  });
  mediaRecorder.addEventListener('stop', () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    setAudioBlob(audioBlob);
    // Initialize waveform
    const audioUrl = URL.createObjectURL(audioBlob);
    const waveSurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
    });
    waveSurfer.load(audioUrl);
    setWaveform(waveSurfer);
  });
  setRecording(true);
  setRecordingTime(0);
  timerRef.current = setInterval(() => {
    setRecordingTime(prev => prev + 1); // Increment recording time
  }, 1000);
};
const stopRecording = () => {
  mediaRecorderRef.current.stop();
  setRecording(false);
  clearInterval(timerRef.current);
};
const handlePlayPause = () => {
  if (waveform) {
    if (isPlaying) {
      waveform.pause();
    } else {
      waveform.play();
    }
    setIsPlaying(!isPlaying);
  }
};
const handleDelete = () => {
  setAudioBlob(null);
  if (waveform) {
    waveform.empty();
  }
};




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
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight:"30px"}}>
          {!currentCall ? (
            <>
              <button 
              // onClick={startAudioCall} 
              style={{ marginRight: '30px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaPhone size={20} />
              </button>
              <button
              //  onClick={startVideoCall} 
               style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaVideo size={20} />
              </button>
            </>
          ) : (
            currentCall === 'audio' ? (
              <AudioCallComponent
                contactName={contactName}
                contactImage={contactImage}
                receiverUser={receiverUser}
                onHangUp={hangUp}
              />
            ) : (
              <VideoCallComponent
                contactName={contactName}
                contactImage={contactImage}
                receiverUser={receiverUser}
                onHangUp={hangUp}
              />
            )
          )}
        </div>



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
          {file && (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={2}
              mt={2}
              display="flex"
              alignItems="center"
            >
              <Image
                src={URL.createObjectURL(file)} // Show image preview
                alt="Selected File"
                boxSize="40px"
                objectFit="cover"
                borderRadius="md"
                mr={3}
              />
              <Text flex="1">{file.name}</Text>
              <IconButton
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={() => setFile(null)}
                aria-label="Remove File"
                size="sm"
                colorScheme="red"
              />
            </Box>
          )}

          <Box display="flex" alignItems="center" p={2} borderTop="1px solid #ccc" bg="gray.200" onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault(); // Prevent form submission if inside a form
              handleSend(event); // Call the handleSend function
            }
          }}
          >

            <HStack spacing={2}>

              {!recording && !audioBlob ?
                <>
                  <EmojiPicker setNewMessage={setNewMessage} newMessage={newMessage} />
                  <FilePicker setNewMessage={setNewMessage} newMessage={newMessage} setFile={setFile} file={file} />
                </>
                : null}
              {recording ? (
                <Box>
                  <Text color="red.500" fontWeight="bold" style={{ animation: 'blinking 1s infinite' }}>
                    Recording
                  </Text>
                  <Text color="black">{recordingTime}s</Text>
                </Box>
              ) : null}
              <Box id="waveform" style={{ width: '100%', height: '80px', marginLeft: '10px' }}></Box>
              {audioBlob && !recording ? (
                <IconButton
                  icon={<FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />}
                  onClick={handlePlayPause}
                  aria-label="Play/Pause"
                  bg="blue.500"
                  color="white"
                  marginLeft="10px"
                />
              ) : null}

              {audioBlob ? <IconButton
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={handleDelete}
                aria-label="Delete"
                colorScheme="red"
                marginLeft="10px"
              /> : <></>}

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

            {newMessage || audioBlob || file ? (
              <IconButton
                icon={<FontAwesomeIcon icon={faPaperPlane} />}
                onClick={handleSend}
                onKeyDown={handleSend}
                aria-label="Send Message"
                bg="blue.500"
                color="white"
              />
            ) : (

              <IconButton
                icon={<FontAwesomeIcon icon={recording ? faPause : faMicrophone} />}
                onClick={recording ? stopRecording : startRecording}
                aria-label={recording ? "Stop Recording" : "Start Recording"}
                bg={recording ? "red.500" : "green.500"}
                color="white"
                _hover={{ bg: "red.600" }}
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
}

export default SingleChat;