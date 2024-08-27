import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import  { ChatState } from "../../Context/ChatProvider";


const ChatSetting = ({chatId}) => {

    const toast = useToast();
    const { user } = ChatState();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleHamburgerClick = () => {
        setIsModalOpen(true);
        setIsHovered(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleBlockUser = () => {
        // Perform the block user action here
    };

    const handleViewProfile = () => {
        // Perform the view profile action here
    };

    const handleDeleteChat = async () => {
        // Perform the delete chat action here
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const response = await axios.delete(
                `/api/chat/deletechat/${chatId}`,
                config
            );


            // socket.emit("deleted message", response);
            // Handle the response data as needed
            console.log(response.data, "after deleted emit");
            // Show success toast message
            toast({
                title: "Chat Deleted",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setIsModalOpen(false)
            // setFetchAgain(!fetchAgain);
        } catch (error) {
            console.log(error.response, "in catch errrorrror")
            const errorMessage = error.response.data.message;
            console.error(error);
            // Handle any errors that occur during the request
            // Show error toast message
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };


    const handleHamburgerMouseLeave = () => {
        setIsHovered(false);
        // ... your code ...
    };


    return (
        <>
            <HamburgerIcon ml={3} onClick={handleHamburgerClick} onMouseLeave={handleHamburgerMouseLeave}
                cursor="pointer"
                color={isHovered ? "red" : "black"}
                _hover={{ color: "#38B2AC" }} />
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="sm">
                <ModalOverlay />
                <ModalContent
                    maxW="280px"
                    borderRadius="md"
                    boxShadow="lg"
                    textAlign="center"
                >
                    <ModalHeader>Options</ModalHeader>
                    <ModalBody>
                        <Flex direction="column" align="center">
                            {/* Add your options here */}
                            <Button variant="ghost" onClick={handleDeleteChat} colorScheme="#38B2AC"
                                fontWeight="normal"
                                _hover={{ bg: "#38B2AC", color: "white" }}>
                                Delete Chat
                            </Button>
                            <Button variant="ghost" onClick={handleViewProfile} colorScheme="#38B2AC"
                                fontWeight="normal"
                                _hover={{ bg: "#38B2AC", color: "white" }}>
                                View Profile
                            </Button>
                            <Button variant="ghost" onClick={handleBlockUser} colorScheme="#38B2AC"
                                fontWeight="normal"
                                _hover={{ bg: "#38B2AC", color: "white" }}>
                                Block User
                            </Button>
                            {/* ... and so on ... */}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleCloseModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    );
};

export default ChatSetting;
