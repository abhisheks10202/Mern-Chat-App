import React from 'react';
import { Box, Image,IconButton} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
const ImageMessage = ({ imageUrl }) => {
  return (
    <Box
      borderWidth=""
      borderRadius="md"
      // p={2}
      width="300px" // Set the width of the box
      height="200px" // Set the height of the box
      overflow="hidden" // Ensure any overflow is hidden
      // boxShadow="md" // Optional: Add shadow for better visual separation
    >
      <Image
        src={imageUrl} // Get the image URL
        alt="Message Image"
        objectFit="cover" // Cover to maintain aspect ratio
        width="100%"
        height="100%"
      />
       <IconButton
                icon={<FontAwesomeIcon icon={faDownload} />}
                aria-label="Download Image"
                position="absolute" 
                bottom="2px" 
                right="2px" 
                height="30px"
                width="20px"
                onClick={() => downloadImage(imageUrl)} // Call download function
            />
    </Box>
  );
};
const downloadImage = (url) => {
  const link = document.createElement('a');
  link.href = url; 
  link.target = "_blank"; // Open in a new tab for images hosted on the web
  link.setAttribute('download', url.split('/').pop()); // Set the download attribute
  // Append link to the body (required for Firefox)
  document.body.appendChild(link);
  link.click(); // Simulate click to trigger download
  document.body.removeChild(link); // Clean up
};
export default ImageMessage;