import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import ProfileModal from "../miscellaneous/ProfileModal";
import { getSender, getSenderFull } from "../../config/ChatLogics";




const ChatSetting = ({ selectedChat, setFetchAgain, fetchAgain, fetchMessages, messages }) => {

    const toast = useToast();
    const { user, setSelectedChat } = ChatState();
    const blockedUserIds = new Set();


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const chatId = selectedChat._id;
    const [showProfileModal, setShowProfileModal] = useState(false);
    const isGroupChat = selectedChat.isGroupChat;

    const [blocker, setBlocker] = useState('');
    const [blocked, setBlocked] = useState('');
    const [isBlocked, setIsBlocked] = useState(null);
    const [error, setError] = useState(null);

    const handleCheckBlockStatus = async () => {
        // setIsBlocked(false);
        const chatId = selectedChat._id;
        setBlocker(user._id);
        const id = selectedChat.users.filter((u) => u._id != user._id)
        console.log("blocked" + id[0]._id)
        setBlocked(id[0]._id);
        console.log(blocked + "---");

        try {
            const response = await axios.get(`/api/block/check-block-status?blocked=${blocked}&blocker=${blocker}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` // Add your token here if required
                }
            });
            console.log(response.data.isBlocked)
            setIsBlocked(response.data.isBlocked)

            if (!response) {
                throw new Error('Network response was not ok');
            }

            console.log(isBlocked + "hxjkbdkjbxmjcb")
        } catch (error) {
            setError(error.message);
        }
    };


    const handleHamburgerClick = () => {
        setIsModalOpen(true);
        setIsHovered(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
            setFetchAgain(!fetchAgain)
            setSelectedChat(null);

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
        setIsBlocked("");
        handleCheckBlockStatus();
    }, [selectedChat]);

    useEffect(() => {
        // Perform any additional actions or logic here after the showProfileModal state changes
    }, [showProfileModal]);

    // useEffect(() => {
    //     handleCheckBlockStatus()
    // }, [selectedChat]);

    // const fetchBlocked = async () => {
    //     if (!selectedChat) return;
    //     setIsBlocked(false)
    //     console.log(messages)

    //     try {
    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${user.token}`,
    //             },
    //         };

    //         //   setLoading(true);
    //         console.log(user._id)
    //         const { data } = await axios.get(
    //             `/api/block/${user._id}`,
    //             config
    //         );
    //         console.log(data, "gedgg");

    //         // messages.forEach((message) => {
    //         //     setTimeout(() => {
    //         //         if (message.chat && message.chat.users) {
    //         //             message.chat.users.forEach((userId, index) => {
    //         //                 if (userId.toString() !== user._id.toString()) {
    //         //                     blockedUserIds.add(userId);
    //         //                     // console.log(userId,"hehehehehehehheh")
    //         //                 }
    //         //             });

    //         //         }
    //         //     }, 1000);
    //         // });
    //         // console.log(messages)


    //         // data.forEach(item => {
    //         //     setTimeout(() => {
    //         //       console.log([...blockedUserIds][0].toString(), item.blocked._id.toString() + " " + item.blocker.toString() + "  ", user._id.toString(), "khatma tatat ")
    //         //       if ([...blockedUserIds][0].toString() === item.blocked._id.toString() && item.blocker.toString() === user._id.toString()) {
    //         //         setIsBlocked(true)
    //         //       }
    //         //     }, ); // Set the desired timeout value (in milliseconds)
    //         //   });






    //     } catch (error) {
    //         toast({
    //             title: "Error Occured!",
    //             description: "Failed to Load the Blocked",
    //             status: "error",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "bottom",
    //         });
    //     }
    // };


    const handleUnblockUser = async (req, res) => {
        // Perform the block user action here
        if (!selectedChat) return;
        console.log(user._id, blocked+"fjnfenefn");
        console.log(user.token+"token");


        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                     'Content-Type': 'application/json'
                },
            };
            const { data } = await axios.delete(
                "/api/block/unblock",
                {
                    blockerId: user._id,
                    blockedId: blocked,
                },
                config
            );
            toast({
                title: "User unblocked successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed Unblock the User",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const handleBlockUser = async (req, res) => {
        // Perform the block user action here
        if (!selectedChat) return;


        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                "/api/block",
                {
                    blockerId: user._id,
                    blockedId: blocked,
                },
                config
            );
            toast({
                title: "User blocked successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load tblocked or user already blocked",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };


    return (
        <>
            <HamburgerIcon ml={3} onClick={() => { handleHamburgerClick(); handleCheckBlockStatus() }} onMouseLeave={handleHamburgerMouseLeave}
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

                            {!isGroupChat ?
                                (<ProfileModal user={getSenderFull(user, selectedChat.users)} >
                                    <Button variant="ghost" colorScheme="#38B2AC"
                                        fontWeight="normal"
                                        // d={{ base: "flex" }}
                                        _hover={{ bg: "#38B2AC", color: "white" }}>
                                        VIew Profile
                                        {/* d={{ base: "flex" }} */}
                                    </Button>
                                </ProfileModal>) :
                                (<UpdateGroupChatModal fetchMessages={fetchMessages}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}>

                                    <Button variant="ghost" colorScheme="#38B2AC"
                                        fontWeight="normal"
                                        // d={{ base: "flex" }}
                                        _hover={{ bg: "#38B2AC", color: "white" }}>
                                        Group Profile
                                        {/* d={{ base: "flex" }} */}
                                    </Button>

                                </UpdateGroupChatModal>)
                            }


                            <Button variant="ghost" onClick={!isBlocked ? handleBlockUser : handleUnblockUser} colorScheme="#38B2AC" fontWeight="normal" _hover={{ bg: "#38B2AC", color: "white" }}>
                                {!isGroupChat && !isBlocked ? "Block user" : "Unblock User"}
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
