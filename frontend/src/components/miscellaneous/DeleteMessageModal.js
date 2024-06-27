import React, { useState } from "react";
import {
  Box,
  IconButton,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const DeleteMessageModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const cancelRef = React.useRef();

  const handleDelete = () => {
    if (deleteType === "me") {
      //   onDeleteForMe(message._id);
    } else if (deleteType === "everyone") {
      //   onDeleteForEveryone(message._id);
    }
    setAlertOpen(false);
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      borderWidth={1}
      borderRadius="md"
      mb={2}
    >
      <Text>hi</Text>
      <Popover>
        <PopoverTrigger>
          <IconButton icon={<ChevronDownIcon />} />
        </PopoverTrigger>
        <PopoverContent width="fit-content">
          <PopoverArrow />
          <PopoverBody>
            <Button
              colorScheme="blue"
              onClick={() => {
                setDeleteType("me");
                setAlertOpen(true);
                onClose();
              }}
            >
              Delete for Me
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setDeleteType("everyone");
                setAlertOpen(true);
                onClose();
              }}
            >
              Delete for Everyone
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <AlertDialog
        isOpen={alertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Delete
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to{" "}
              {deleteType === "me"
                ? "delete this message for yourself"
                : "delete this message for everyone"}
              ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default DeleteMessageModal;
