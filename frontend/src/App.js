import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import Deleted from "./components/Deleted";
import ChatBot from "./components/ChatBot";
import { BlockProvider } from "./Context/BlockContext";


function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <BlockProvider>
      <Route path="/chats" component={Chatpage} />
      <Route path="/chat" component={Deleted} />
      <Route path="/chatbot" component={ChatBot} />
      </BlockProvider>
    </div>
  );
}

export default App;