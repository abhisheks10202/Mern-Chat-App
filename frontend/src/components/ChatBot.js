
import React, { useState } from 'react';
import axios from 'axios';
import { Input, HStack, Button, ButtonGroup, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
// import { ChatState } from "../Context/ChatProvider"

const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isOpen, setIsOpen] = useState(false); // State to control the modal visibility

    // const [search, setSearch] = useState("");
    // const [searchResult, setSearchResult] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [loadingChat, setLoadingChat] = useState(false);
  
    // const {
    //   setSelectedChat,
    //   user,
    //   notification,
    //   setNotification,
    //   chats,
    //   setChats,
    // } = ChatState();


  
    const sendMessage = async () => {
      // chats.forEach((chat) => {
      //   if (user._id== chat.users[1]._id&& chat.isChatBot === false) {
      //     console.log("rajmma");
      //   }
      // });
      //  console.log(chats[0].users[1]._id)
      //  console.log(user._id)

      try {
        const res = await axios.post('http://localhost:3000/api/chatbot/send-payload', { message });
        console.log(res);
        setResponse(res.data.text.replace(/\n/g, '\n\n'));
        setIsOpen(true); // Open the modal after receiving the response
      } catch (error) {
        console.error('Error:', error);
      }
      setMessage("")
    };
  
    const handleCloseModal = () => {
      setIsOpen(false); // Close the modal
    };
  
    return (
      <div>
        <HStack spacing={2}>
          <Input placeholder="Ask Bot" value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={sendMessage} size="sm" rightIcon={<ArrowForwardIcon />} colorScheme="teal" variant="outline">
            Send
          </Button>
        </HStack>
  
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Response:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>{response}</p>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  };
  export default ChatBot;