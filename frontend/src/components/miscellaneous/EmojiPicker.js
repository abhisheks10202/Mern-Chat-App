import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import React, { useRef } from 'react';
import Picker from 'emoji-picker-react';
import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperclip, faSmile, faPaperPlane, faPause } from '@fortawesome/free-solid-svg-icons';

const EmojiPicker = ({ setNewMessage, newMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject, event) => {
 
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
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
    </>
  );
};

export default EmojiPicker;
