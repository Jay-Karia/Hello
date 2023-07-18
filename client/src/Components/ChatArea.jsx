import React, { useEffect, useState } from "react";

import {
  Container,
  Image,
  Text,
  Input,
  IconButton,
  InputRightElement,
  InputGroup,
  useToast,
  Spinner,
  Avatar,
  Tooltip
} from "@chakra-ui/react";

import ChatModel from "./ChatModel";

import ScrollableChat from "./ScrollableChat";

import { RiSendPlane2Fill, RiMore2Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import no_conversation from "./assets/no conversation.jpg";

import io from "socket.io-client"
const ENDPOINT = "https://hello-chat-app-kappa.vercel.app/"
var socket, selectedChatCompare;

const ChatArea = () => {
  // const [chat, setChat] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false)
  const toast = useToast();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const token = JSON.parse(localStorage.getItem("userInfo")).token

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  const dispatch = useDispatch();
  const currentChat = useSelector((state) => state.chat);

  const sendMessage = async () => {
    // alert(message.trim());
    if (message.trim().length <= 0) {
      toast({
        title: "Please enter a message",
        status: "error",
        isClosable: true,
        duration: "5000"
      });
    } else {
      await fetch("https://hello-chat-app-kappa.vercel.app/api/message", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization:
            token
        },
        body: JSON.stringify({
          content: message,
          chatId: currentChat.payload.chat._id
        })
      })
        .then((res) => res.json())
        .then((data) => {
          // setMessages([...messages, data]);
          let newArr = [...messages];
          newArr.push(data.messages);
          setMessages(newArr);
          socket.emit("new message", data)
          localStorage.setItem("messages", messages);
          // alert(JSON.stringify(messages));
        });
      setMessage("");
      getAllMessages();
    }
  };

  const getAllMessages = async () => {
    setFetchLoading(true);
    await fetch(
      `https://hello-chat-app-kappa.vercel.app/api/message/${currentChat.payload.chat._id}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization:
            token
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFetchLoading(false);
        setMessages(data.messages);
        socket.emit("join chat", currentChat.payload.chat._id)
        localStorage.setItem("messages", JSON.stringify(messages));
      });
  };

  useEffect(() => {
    try {
      if (currentChat.length != 0)
      getAllMessages();
      selectedChatCompare = currentChat.payload.chat
    } catch {}
  }, [currentChat.payload]);
  

  const typingHandler = () => {};

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connection", ()=> {
      setSocketConnected(true)
    })

  }, [])

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.message.chat._id) {
        // Give notification
      } else {
        if (currentChat.length != 0)
        getAllMessages()
      }
    })
  }, [messages])
  

  return (
    <>
      {currentChat.payload ? (
        <Container maxWidth="100vw" width="100%" m="0" bg="#EBEBEB" p="0px">
          {/* Title Bar */}
          <Container
            maxWidth="100vw"
            borderBottom="1px solid black"
            w="100%"
            m="0"
            h="50px"
            bg="white"
            padding="0"
          >
            <Container
              maxWidth="100vw"
              m="0"
              style={{
                display: "flex",
                flexDirection: "row"
              }}
              height="100%"
              width="100%"
              // border="2px solid black"
              padding="5px"
            >
               <Avatar name={currentChat.payload.chat.chatName == user.user.name ? currentChat.payload.chat.users[0].name : currentChat.payload.chat.chatName} h="40px" w="40px"/>
              <Text
                padding="0"
                paddingLeft="10px"
                fontFamily="Inter"
                fontWeight="300"
                fontSize="20px"
                letterSpacing="0.1em"
              >
                {currentChat.payload.chat.chatName == user.user.name ? currentChat.payload.chat.users[0].name : currentChat.payload.chat.chatName}
              </Text>

              <ChatModel
                chat={currentChat.payload.chat}
                groupName={currentChat.payload.chat.chatName}
                isGroupChat={currentChat.payload.chat.isGroupChat}
                users={currentChat.payload.chat.users}
              />
            </Container>
          </Container>
          {/* Chat Box */}

          {/* TODO: Solve bug in socket.io */}
          {/* TODO: Deploy */}
          <Container
            maxWidth="100vw"
            m="0"
            h="86%"
            padding="20px"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end"
            }}
          >
            {/* Messages */}
            {fetchLoading ? (
              <Spinner
                alignSelf="center"
                thickness="3px"
                speed="0.5s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
                margin="auto"
              />
            ) : (
             <ScrollableChat messages={messages} user={user}/>
            )}
          </Container>

          {/* Message Input */}
          <Container
            maxWidth="100vw"
            m="0"
            h="auto"
            bg="lightgrey"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            padding="10px"
          >
            <InputGroup width="99%">
              <Input
                bg="white"
                fontFamily="Inter"
                focusBorderColor="grey"
                placeholder="Type a message"
                h="50px"
                onChange={(e) => {
                  setMessage(e.target.value);
                  typingHandler();
                }}
                value={message}
                // right={<RxCross2 />}
              />
              <InputRightElement marginTop="5px">
                <RxCross1
                  size={20}
                  onClick={() => {
                    setMessage("");
                  }}
                />
              </InputRightElement>
            </InputGroup>
            <IconButton
              isLoading={loading}
              background="#b3d0f5"
              icon={<RiSendPlane2Fill />}
              m="10px"
              p="0"
              border="1px solid black"
              borderRadius="100px"
              onClick={() => {
                sendMessage();
              }}
            />
          </Container>
        </Container>
      ) : (
        <Container
          maxWidth="100vw"
          width="100%"
          m="0"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Image
            src={no_conversation}
            style={{
              aspectRatio: "1.5",
              height: "250px"
            }}
          />
          <Text fontFamily="Anaheim" fontWeight="400" fontSize="25px">
            No Conversations yet
          </Text>
        </Container>
      )}
    </>
  );
};

export default ChatArea;
