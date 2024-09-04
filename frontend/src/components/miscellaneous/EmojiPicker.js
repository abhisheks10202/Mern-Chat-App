
import "../styles.css"
import { IconButton } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import Picker from 'emoji-picker-react';
const EmojiPicker = ({ setNewMessage, newMessage }) => {
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
  };
  const handleDocumentClick = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
    };
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <IconButton
        icon={<FontAwesomeIcon icon={faSmile} />}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        aria-label="Emoji Picker"
        bg="gray.500"
        color="white"
        _hover={{ bg: "gray.600" }}
      />
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="emoji-picker-wrapper">
          <Picker
            onEmojiClick={handleEmojiClick}
            pickerStyle={{ width: '200px', height: '200px' }} // Set the width and height here
          />
        </div>
      )}
    </div>
  );
};
export default EmojiPicker;