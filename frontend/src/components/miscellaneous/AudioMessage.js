import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const AudioMessage = ({ audioUrl }) => {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        // Create WaveSurfer instance
        wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "black",       // Set wave color to gray
            progressColor: "red",   // Set progress color to darker gray
            height: 30,              // Height of the waveform
            responsive: true,
            backend: "MediaElement",  // Ensure compatibility on different browsers
        });
        // Load the audio file
        wavesurferRef.current.load(audioUrl);
        // Set the duration when the audio is loaded
        wavesurferRef.current.on("ready", () => {
            setDuration(wavesurferRef.current.getDuration());
        });
        // Update current time periodically
        const timeInterval = setInterval(() => {
            if (isPlaying) {
                setCurrentTime(wavesurferRef.current.getCurrentTime());
            }
        }, 1000); // Update every second
        return () => {
            clearInterval(timeInterval);
            wavesurferRef.current.destroy(); // Cleanup
        };
    }, [audioUrl]);
    const handlePlayPause = () => {
        wavesurferRef.current.playPause();
        setIsPlaying(!isPlaying);
    };
    // Format time in MM:SS
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };
    return (
        <Box 
        borderWidth="0" // Set borderWidth to "0" to remove outline
        borderRadius="md" 
        overflow="hidden" 
            p="2" 
            my="2" 
            bg="transparent"
            width="200px" // Adjusted width to make the box smaller
            >
            <Box display="flex" alignItems="center">
                <IconButton
                    aria-label="Play/Pause"
                    icon={<FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />}
                    onClick={handlePlayPause}
                    size="sm"
                    variant="link" // Display the icon without button styling
                    mr="2" // Margin to the right for spacing
                />
                <Box ref={waveformRef} width="100%" flexGrow={1} height="30px"></Box> {/* Ensures waveform takes max width */}
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2" fontSize="xs">
                <Text>{formatTime(currentTime)}</Text>
                <Text>{formatTime(duration)}</Text>
            </Box>
        </Box>
    );
};
export default AudioMessage;