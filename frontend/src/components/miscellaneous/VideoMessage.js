import React, { useRef, useState } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faDownload } from '@fortawesome/free-solid-svg-icons';
const VideoMessage = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = videoUrl.split('/').pop(); // Use the filename from the URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Box position="relative" display="block" maxWidth="400px" margin="auto">
      <video 
        ref={videoRef} 
        width="100%" 
        controls 
        src={videoUrl} 
        style={{ borderRadius: '8px' }} 
      />
      
    </Box>
  );
};
export default VideoMessage;