import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UpdateGroupChatModal from "../miscellaneous/GroupChatModal";
import ProfileModal from "../miscellaneous/ProfileModal";
import { getSender, getSenderFull } from "../../config/ChatLogics";




const ChatSetting = ({ selectedChat,setFetchAgain,fetchAgain,fetchMessages }) => {

    const toast = useToast();
    const { user } = ChatState();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const chatId = selectedChat._id;
    const [showProfileModal, setShowProfileModal] = useState(false);
    const isGroupChat = selectedChat.isGroupChat;
    // const { isOpen, onOpen, onClose } = useDisclosure();

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
        setIsModalOpen(false);
        setShowProfileModal(true);

    };
    const handleGroupProfile = () => {
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

    useEffect(() => {
        // Perform any additional actions or logic here after the showProfileModal state changes
    }, [showProfileModal]);


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
                            <Button variant="ghost" onClick={isGroupChat ? handleGroupProfile : handleViewProfile} colorScheme="#38B2AC"
                                fontWeight="normal"
                                _hover={{ bg: "#38B2AC", color: "white" }}>
                                {isGroupChat ? "Group Profile" : "View Profile"}
                            </Button>
                                

{/* {isGroupChat ? (
            <UpdateGroupChatModal
              fetchMessages={fetchMessages}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
            
          ) : (
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
          )} */}
                           

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
            {/* {showProfileModal && (
                <ProfileModal onOpenuser={getSenderFull(user, selectedChat.users)} onClose={() => setShowProfileModal(false)} />
            )} */}
        </>

    );
};

export default ChatSetting;
