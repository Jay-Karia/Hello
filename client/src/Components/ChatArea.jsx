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

import { RiSendPlane2Fill, RiMore2Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import no_conversation from "./assets/no conversation.jpg";

const ChatArea = () => {
  // const [chat, setChat] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
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
      await fetch("http://localhost:8000/api/message", {
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
          localStorage.setItem("messages", messages);
          // alert(JSON.stringify(messages));
        });

      // toast({
      //   title: "Message sent",
      //   status: "success",
      //   isClosable: true,
      //   duration: "5000"
      // });
      setMessage("");
      getAllMessages();
    }
  };

  const getAllMessages = async () => {
    setFetchLoading(true);
    await fetch(
      `http://localhost:8000/api/message/${currentChat.payload.chat._id}`,
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
        // alert(JSON.stringify(data.messages));
        localStorage.setItem("messages", JSON.stringify(messages));
      });
  };

  useEffect(() => {
    getAllMessages();
  }, [currentChat.payload]);

  const typingHandler = () => {};

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

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
              <Image
                src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                border="1px solid black"
                borderRadius="100px"
                h="40px"
                style={{
                  aspectRatio: "1"
                }}
              />
              <Text
                padding="0"
                paddingLeft="10px"
                fontFamily="Inter"
                fontWeight="300"
                fontSize="20px"
                letterSpacing="0.1em"
              >
                {currentChat.payload.chat.chatName}
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
              messages.map((e, i) => {
                return e ? (
                  e.sender._id === user.user._id ? (
                    <div className="text-right" id={e._id}>
                      <Container
                        minWidth="10%"
                        maxWidth="50%"
                        minHeight="56px"
                        margin="10px"
                        width="fit-content"
                        // width="fit-content"
                        borderRadius="10px"
                        background="#AFA4F3"
                        height="auto"
                        borderTopLeftRadius="0"
                        // position="absolute"
                        // float="right"
                      >
                        <Text
                          fontFamily="Inter"
                          fontWeight="400"
                          align="left"
                          fontSize="20px"
                          paddingTop="5px"
                        >
                          {e.content}
                        </Text>
                        <Text
                          fontFamily="Inter"
                          fontWeight="300"
                          fontSize="15px"
                          align="right"
                        >
                          {new Date(e.updatedAt).getHours()}:
                          {new Date(e.updatedAt).getMinutes() < 10
                            ? "0" + new Date(e.updatedAt).getMinutes()
                            : new Date(e.updatedAt).getMinutes()}
                        </Text>
                      </Container>
                    </div>
                  ) : (
                    <div
                      class="text-left"
                      id={e._id}
                      style={{
                        paddingLeft:
                          isSameSender(messages, e, i, user.user._id) ||
                          isLastMessage(messages, i, user._id)
                            ? ""
                            : "30px"
                      }}
                    >
                      {isSameSender(messages, e, i, user.user._id) ||
                      isLastMessage(messages, i, user._id) ? (
                        <Tooltip
                          label={e.sender.name}
                          placement="bottom-start"
                          hasArrow
                        >
                          <Avatar
                            src={e.sender.picture}
                            mt="7px"
                            nr={1}
                            size="sm"
                            cursor="pointer"
                            name={e.sender.name}
                            border="1px solid black"
                          ></Avatar>
                        </Tooltip>
                      ) : (
                        ""
                      )}
                      <Container
                        minWidth="10%"
                        maxWidth="50%"
                        minHeight="56px"
                        margin="10px"
                        width="fit-content"
                        borderRadius="10px"
                        background="white"
                        height="auto"
                        borderTopLeftRadius="0"
                      >
                        <Text
                          fontFamily="Inter"
                          fontWeight="400"
                          align="left"
                          fontSize="20px"
                          paddingTop="5px"
                          paddingRight="10px"
                        >
                          {e.content}
                        </Text>
                        <Text
                          fontFamily="Inter"
                          fontWeight="300"
                          fontSize="15px"
                          align="right"
                        >
                          {new Date(e.updatedAt).getHours()}:
                          {new Date(e.updatedAt).getMinutes() < 10
                            ? "0" + new Date(e.updatedAt).getMinutes()
                            : new Date(e.updatedAt).getMinutes()}
                        </Text>
                      </Container>
                    </div>
                  )
                ) : (
                  ""
                );
              })
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
