import React, { useEffect } from "react";

import { Box } from "@chakra-ui/react";

import SideBar from "../Components/SideBar";
import ChatArea from "../Components/ChatArea";

const ChatPage = () => {
  // const { user } = ChatState();
  // useEffect(() => {
  //   console.log(user);
  // }, []);
  return (
    <div
      style={{
        width: "100%",
        background: "white",
        height: "100%",
        padding: "0",
        margin: "0"
      }}
    >
      <Box
        style={{
          display: "flex"
        }}
      >
        <SideBar />
        <ChatArea />
      </Box>
    </div>
  );
};

export default ChatPage;
