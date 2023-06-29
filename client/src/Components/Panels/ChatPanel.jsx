import React, { useEffect, useState } from "react";

import { Container, Text, Button, Image, useToast } from "@chakra-ui/react";
import no_chats from "../assets/no chats.jpg";
import { Spinner } from "@chakra-ui/react";

import ScrollableFeed from "react-scrollable-feed";

import { RiRefreshLine } from "react-icons/ri";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { chatActions } from "../store";

const ChatPannel = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [latestMessage, setLatestMessage] = useState([]);

  const token = JSON.parse(localStorage.getItem("userInfo")).token

  const toast = useToast();

  const getChats = async () => {
    setLoading(true);
    console.log(token)
    try {
      await fetch("http://localhost:8000/api/chat/", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization:
            token
        }
      })
        .then((res) => res.json())
        .then(async (data) => {
          setChats(data.results);
          localStorage.setItem("chats", JSON.stringify(data.results));
          setLoading(false);
          // for (let i = 0; i < chats.length; i++) {
          //   if (chats[i].latestMessage) {
          //     await fetch(
          //       `http://localhost:8000/api/message/get/${chats[i].latestMessage}`,
          //       {
          //         method: "GET",
          //         headers: {
          //           "Content-type": "application/json",
          //           Authorization:
          //             "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzQzOWIyNGU2MmM2YTVmNDNkNWJlNCIsImlhdCI6MTY4MTc0ODgzNn0.DkTc2yvFb5ArneyMLxJTVVrA1A7NHI9maFp-JVDiRho"
          //         }
          //       }
          //     )
          //       .then((res) => res.json())
          //       .then((data) => {
          //         let newArr = latestMessage;
          //         let limit = 20;
          //         newArr[i] = data.message.content;
          //         if (newArr[i].length > limit)
          //           newArr[i] = newArr[i].substring(0, limit) + "...";
          //         setLatestMessage(newArr);
          //         console.log(newArr);
          //       });
          //   } else {
          //     // newArr[i] = "";
          //   }
          // }
        });
    } catch (error) {
      toast({
        title: error,
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
  };
  const dispatch = useDispatch();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const currentChat = useSelector((state) => state.chat);

  const accessChat = async (user, chatId) => {
    setLoading(true);
    try {
      let userId = "";
      if (user.length < 2) userId = user[0]._id;
      // chat user is
      else userId = user[1]._id;
      // const userId = JSON.parse(localStorage.getItem("userInfo")).user._id; // logged in user id

      await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization:
            token
        },
        body: JSON.stringify({ chatId: chatId, userId: userId })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setSelectedChat(data);
          localStorage.setItem("selectedChat", JSON.stringify(data));
          dispatch(chatActions.select(data));
          setLoading(false);
        });
    } catch (error) {
      toast({
        title: error,
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
  };

  useEffect(() => {
    try {
        const localChats = localStorage.getItem("chats");
        if (localChats.length !== 0) {
          getChats();
        } else {
          setChats(localChats);
        }
    } catch {
      getChats();
    }
  }, []);

  return (
    <>
      <Container
        w="100%"
        h="100%"
        p="0"
        // border="2px solid black"
        // marginRight="0px"
      >
        <Container
          marginTop="20px"
          borderRadius="10px"
          bg="#A9D6FF"
          w="90%"
          padding="0"
        >
          <Text
            fontFamily="Arima"
            align="center"
            fontWeight="400"
            fontSize="30px"
          >
            Chats
          </Text>
        </Container>

        <ScrollableFeed>
          <Container marginTop="50px" height="auto" d="flex" p="0">
            {/* Chat Container */}
            {chats.length > 0 ? (
              chats.map((e, i) => {
                return (
                  <Container
                    onClick={() => {
                      accessChat(e.users, e._id);
                    }}
                    w="100%"
                    h="auto"
                    p="10px"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px"
                    }}
                    _hover={{
                      background: "hsl(44, 9%, 95%)",
                      cursor: "pointer"
                    }}
                    // borderRadius="15px"
                  >
                    <Image
                      src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      style={{
                        aspectRatio: "1",
                        width: "50px",
                        // border: "2px solid black",
                        borderRadius: "100px"
                      }}
                    />
                    <Container
                      style={{
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <Text fontFamily="Inter" fontSize="20px" fontWeight="400" align={"left"}>
                        {chats[i].chatName}
                      </Text>
                      <Container
                        style={{
                          // border: "2px solid black",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: "0",
                          alignItems: "center"
                        }}
                      >
                        <Text
                          fontFamily="Inter"
                          fontSize="15px"
                          fontWeight="300"
                        >
                        {chats[i].latestMessage}
                          {/* {latestMessage[i]} */}
                        </Text>
                        <Text
                          fontFamily="Inter"
                          fontSize="13px"
                          fontWeight="300"
                        >
                          {new Date(chats[i].updatedAt).getHours()}:
                          {new Date(chats[i].updatedAt).getMinutes() < 10
                            ? "0" + new Date(chats[i].updatedAt).getMinutes()
                            : new Date(chats[i].updatedAt).getMinutes()}
                        </Text>
                      </Container>
                    </Container>
                  </Container>
                );
              })
            ) : (
              <Container
                h="80vh"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <Image src={no_chats} />
                <Text fontFamily="Anaheim" fontSize="25px" fontWeight="400">
                  No Chats
                </Text>
              </Container>
            )}
            {/* end */}
          </Container>
          <Container marginTop="20px" align="center">
            {loading ? (
              <Spinner
                thickness="4px"
                speed="0.9s"
                emptyColor="gray.200"
                color="purple.500"
                size="lg"
              />
            ) : (
              ""
            )}
          </Container>
          <Container
            p="0"
            m="0"
            width="50%"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              position: "absolute",
              bottom: "0"
              // width: "22%"
            }}
          >
            <Button
              marginTop="20px"
              // border="1px solid black"
              style={{
                backgroundColor: "white"
              }}
              onClick={() => {
                getChats();
              }}
            >
              <RiRefreshLine size={20} />
            </Button>
          </Container>
        </ScrollableFeed>
      </Container>
    </>
  );
};

export default ChatPannel;
