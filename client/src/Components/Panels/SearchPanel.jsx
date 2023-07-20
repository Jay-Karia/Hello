import React, { useState } from "react";

import {
  Container,
  Text,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  InputRightAddon,
} from "@chakra-ui/react";

import { Avatar } from '@chakra-ui/react'

import { Spinner, useToast } from "@chakra-ui/react";

import { useDispatch } from "react-redux";
import { chatActions } from "../store";

import { Search2Icon, SearchIcon } from "@chakra-ui/icons";
import no_search from "../assets/no search.jpg";

const SearchPannel = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState([]);

  const toast = useToast();

  const token = JSON.parse(localStorage.getItem("userInfo")).token

  const dispatch = useDispatch();

  const searchUser = async () => {
    setLoading(true);
    if (search.length !== 0) {
      try {
        await fetch(`https://hello-chat-app-kappa.vercel.app/api/user/?search=${search}`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authorization:
              token
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setSearchResult(data);
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
    }
  };

  const accessChat = async (user) => {
    setLoading(false);
    try {
      const userId = JSON.parse(localStorage.getItem("userInfo")).user._id; // logged in user id
      const user_id = user._id; // new user id

      // alert(user._id);
      await fetch("https://hello-chat-app-kappa.vercel.app/api/chat", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization:
            token
        },
        body: JSON.stringify({ userId: user_id, secondUser: userId })
      })
        .then((res) => res.json())
        .then((data) => {
          toast({
            title: data.msg,
            status: data.status,
            duration: 5000,
            isClosable: true
          });
          // console.log(data);
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

  return (
    <>
      <Container
        w="100%"
        h="100%"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <Container marginTop="20px" borderRadius="10px" bg="#A9FFD6" w="90%">
          <Text
            fontFamily="Arima"
            align="center"
            fontWeight="400"
            fontSize="30px"
          >
            Search
          </Text>
        </Container>
        <InputGroup marginTop="20px" width="90%">
          <Input
            type="text"
            placeholder="Search User"
            fontFamily="Inter"
            fontWeight="300"
            fontSize="15px"
            size="lg"
            height="40px"
            borderRadius="10px"
            background="#E5E5E5"
            focusBorderColor="grey"
            onEnded={<Button>Go</Button>}
            onChange={(e) => {
              setSearch(e.target.value);
              searchUser();
            }}
          />
          <InputRightAddon
            bg="grey.300"
            onClick={() => {
              searchUser();
            }}
            marginBottom="30px"
            borderRadius="0 10px 10px 0"
            children={<Search2Icon color="gray.400" />}
          />
        </InputGroup>
        {/* User Container */}
        {searchResult.length > 0 ? (
          searchResult.map((e, i) => {
            let margin = 0;
            i === 0 ? (margin = "0") : (margin = "20px");
            return (
              <Container
                border="1px solid black"
                width="80%"
                height="auto"
                marginTop={margin}
                borderRadius="20px"
                padding="5px"
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                _hover={{
                  background: "hsl(4, 9%, 95%)",
                  cursor: "pointer"
                }}
                onClick={() => {
                  accessChat(e);
                }}
              >
                <Container
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems:"center"
                  }}
                >
                    <Avatar name={searchResult[i].name} style={{width:"40px", height:"40px"}}/>

                  <Container d="flex" flexDir="column">
                    <Text fontFamily="Inter" fontWeight="600" align="left">
                      {searchResult[i].name}
                    </Text>
                    <Text fontFamily="Inter" fontWeight="300" align="left">
                      {searchResult[i].email.length > 21 ? searchResult[i].email.substring(0, 22) + "..." : searchResult[i].email}
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
            <Image src={no_search} />
            <Text fontFamily="Anaheim" fontSize="25px" fontWeight="400">
              No Results Found
            </Text>
          </Container>
        )}
        <Container marginTop="50px" align="center">
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
      </Container>
    </>
  );
};

export default SearchPannel;
