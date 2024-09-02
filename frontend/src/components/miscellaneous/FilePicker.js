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

const FilePicker = ({ setNewMessage, newMessage,file,setFile}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

//   const handleDocumentClick = (event) => {
//     // if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
//     //   setShowEmojiPicker(false);
//     }
//   };

//   useEffect((e) => {
//     document.addEventListener('click', handleDocumentClick, true);
//     return () => {
//       document.removeEventListener('click', handleDocumentClick, false);
//     };
//   }, []);


  return (
    <>
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
    </>
  )
  ;
};

export default FilePicker;
