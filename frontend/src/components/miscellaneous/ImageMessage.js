import React, { useState } from 'react';
import { Box, Image, IconButton, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
const ImageMessage = ({ imageUrl }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Function to download the image
    const downloadImage = (url) => {
        const link = document.createElement('a');
        link.href = url; 
        link.setAttribute('download', url.split('/').pop()); // Set the download attribute
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <Box position="relative" borderWidth="1px" borderRadius="md" overflow="hidden" width="300px" height="200px">
            <Image
                src={imageUrl}
                alt="Message Image"
                objectFit="cover"
                width="100%"
                height="100%"
                onClick={() => setIsOpen(true)} // Open full screen on click
                cursor="pointer" // Change the cursor to indicate that the image is clickable
            />
            <IconButton
                icon={<FontAwesomeIcon icon={faDownload} />}
                aria-label="Download Image"
                position="absolute" 
                bottom="2px" 
                right="2px" 
                height="30px"
                width="30px"
                onClick={() => downloadImage(imageUrl)} // Call download function
            />
            
            {/* Fullscreen Modal */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Image src={imageUrl} alt="Fullscreen Image" maxH="100%" maxW="100%" objectFit="contain" />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};
export default ImageMessage;

// import React, { useState } from 'react';
// import {
//   Box,
//   Image,
//   IconButton,
//   CircularProgress,
//   CircularProgressLabel,
//   Tooltip
// } from '@chakra-ui/react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDownload } from '@fortawesome/free-solid-svg-icons';
// const ImageMessage = ({ imageUrl }) => {
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState(0);
//   const downloadImage = (url) => {
//     const link = document.createElement('a');
//     link.href = url; 
//     link.setAttribute('download', url.split('/').pop()); // Set the download attribute
//     // Start the download and show progress
//     setIsDownloading(true);
//     let progressInterval = setInterval(() => {
//       setDownloadProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(progressInterval); 
//           return 100;
//         }
//         return prev + 10; // Simulating progress
//       });
//     }, 200);
//     // Simulate the download
//     setTimeout(() => {
//       document.body.appendChild(link); // Append link to body
//       link.click(); // Initiate download
//       document.body.removeChild(link); // Clean up
//       setIsDownloading(false);
//       setDownloadProgress(0); // Reset progress
//     }, 2000); // Simulate longer download time
//   };
//   return (
//     <Box position="relative" borderWidth="1px" borderRadius="md" overflow="hidden" width="300px" height="200px">
//       {isDownloading && (
//         <Box 
//           position="absolute" 
//           top="50%" 
//           left="50%" 
//           transform="translate(-50%, -50%)" 
//           textAlign="center"
//         >
//           <CircularProgress value={downloadProgress} color="green.400" size="80px">
//             <CircularProgressLabel>{`${downloadProgress}%`}</CircularProgressLabel>
//           </CircularProgress>
//         </Box>
//       )}
//       <Image
//         src={imageUrl}
//         alt="Message Image"
//         objectFit="cover"
//         width="100%"
//         height="100%"
//         opacity={isDownloading ? 0.5 : 1} // Dim the image when downloading
//       />
//       <Tooltip label="Download Image" aria-label="Download Image" fontSize="md">
//         <IconButton
//           icon={<FontAwesomeIcon icon={faDownload} />}
//           aria-label="Download Image"
//           position="absolute" 
//           bottom="10px" 
//           right="10px" 
//           onClick={() => downloadImage(imageUrl)} // Call download function
//         />
//       </Tooltip>
//     </Box>
//   );
// };
// export default ImageMessage;