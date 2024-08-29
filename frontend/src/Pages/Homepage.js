import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent bgGradient="linear(to right top, #6b7ed1, #428cd7, #0098d4, #00a2cc, #00aac0, #00b4bd, #00beb6, #13c7aa, #1cd6a0, #40e491, #67f07b, #8ffb5f)">
    {/* <Container maxW="xl" centerContent > */}
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        bgGradient="linear(to right top, #6b7ed1, #428cd7, #0098d4, #00a2cc, #00aac0, #00b4bd, #00beb6, #13c7aa, #1cd6a0, #40e491, #67f07b, #8ffb5f)"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" bgGradient="linear(to right top, #6b7ed1, #428cd7, #0098d4, #00a2cc, #00aac0, #00b4bd, #00beb6, #13c7aa, #1cd6a0, #40e491, #67f07b, #8ffb5f)">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
