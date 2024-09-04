import { IconButton } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
const FilePicker = ({ setFile }) => {
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Set the selected file to the parent component's state
      setFile(files[0]);
      console.log("Selected file:", files[0]); // Debugging: Log the selected file
    }
  };
  return (
    // This div wraps everything and ensures the input is functional
    <div>
      <input 
        type="file" 
        id="file-input" // Give it an ID for easy access (optional)
        onChange={handleFileChange} 
        style={{ display: 'none' }} // Hide the file input
        accept="image/*,video/*" // Accepts images and videos
      />
      <IconButton
        icon={<FontAwesomeIcon icon={faPaperclip} />}
        as="label" // Use label functionality
        htmlFor="file-input" // Link the button to the input via id
        aria-label="File Picker"
        style={{ cursor: 'pointer' }} // Visual feedback
        bg="gray.500"
        color="white"
        _hover={{ bg: "gray.600" }}
      />
    </div>
  );
};
export default FilePicker;