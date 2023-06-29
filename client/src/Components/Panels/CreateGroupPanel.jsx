import React, { useState } from "react";

import {
  Container,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Image,
  HStack,
  Box
} from "@chakra-ui/react";
import { Tag, TagLabel, Avatar } from "@chakra-ui/react";

// Transitions
import { Fade, ScaleFade, Slide, SlideFade, Collapse } from "@chakra-ui/react";

// Misc
import { useToast } from "@chakra-ui/react";

// Icons
import { RiFolderAddFill, RiCloseLine } from "react-icons/ri";

const CreateGroupPannel = () => {
  const [name, setName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [prodile, setProfile] = useState("");

  const toast = useToast();

  const token = JSON.parse(localStorage.getItem("userInfo")).token

  const postDetails = (picture) => {
    setLoading(true);
    if (picture === undefined) {
      toast({
        title: "Please select image",
        status: "warning",
        duration: "4000",
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    if (picture.type === "image/jpg" || picture.type === "image/png") {
      const data = new FormData();
      data.append("file", picture);
      data.append("upload_preset", "hello-chat-app");
      data.append("cloud_name", "dkzytvwtx");
      // console.log(data);
      //   axios
      //     .post("https://api.cloudinary.com/v1_1/dkzytvwtx", {
      //       body: data
      //     })
      //     .then((res) => res.json())
      //     .then((data) => {
      //       setProfile(data);
      //       console.log(picture);
      //       setLoading(false);
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //     });
      alert(data);
    }
  };

  const createGroupChat = async (groupName, users) => {
    let ids = [];
    for (let i = 0; i < users.length; i++) {
      ids[i] = users[i]._id;
    }
    try {
      await fetch("http://localhost:8000/api/chat/group", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization:
            token
        },
        body: JSON.stringify({
          groupName: groupName,
          users: ids
        })
      })
        .then((res) => res.json())
        .then((data) => {
          toast({
            title: data.msg,
            status: data.status,
            duration: 5000,
            isClosable: true
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const searchUser = async (search) => {
    // setLoading(true);
    try {
      await fetch(`http://localhost:8000/api/user/?search=${search}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization:
            token
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
          // setLoading(false);
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
        <Container marginTop="20px" borderRadius="10px" bg="#ECB7FF">
          <Text
            fontFamily="Arima"
            align="center"
            fontWeight="400"
            fontSize="30px"
          >
            Create Group
          </Text>
        </Container>

        {/* Form Container */}
        <Container
          marginTop="60px"
          height="auto"
          d="flex"
          flexDirection="column"
          border="1px solid black"
          borderRadius="10px"
          padding="20px"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <VStack spacing="20px" w="90%">
            <FormControl
              isRequired
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }}
            >
              <FormLabel fontFamily="Arima" fontWeight="400" fontSize="20px">
                Group Name:
              </FormLabel>
              <Input
                height="45px"
                bg="#E8E8E8"
                borderRadius="10px"
                focusBorderColor="grey"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>

            <FormControl
              isRequired
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }}
            >
              <FormLabel fontFamily="Arima" fontWeight="400" fontSize="20px">
                Members
              </FormLabel>
              <Input
                value={members}
                placeholder="Search Users"
                height="45px"
                bg="#E8E8E8"
                w="70%"
                fontFamily="Arima"
                borderRadius="100px"
                focusBorderColor="grey"
                onChange={(e) => {
                  setMembers(e.target.value);
                  if (e.target.value.length !== 0) searchUser(e.target.value);
                }}
              />
            </FormControl>

            {/* Member Badges */}
            <HStack
              maxWidth="290px"
              maxHeight="100vh"
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
            >
              {selected.map((e, i) => {
                return (
                  <SlideFade in={isOpen} offsetY={20}>
                    <Tag
                      margin="5px"
                      id={i}
                      size="lg"
                      key="lg"
                      borderRadius="full"
                      variant="solid"
                      // colorScheme="green"
                      backgroundColor="hsl(150, 80%, 70%)"
                    >
                      <TagLabel>{e.name}</TagLabel>
                      <RiCloseLine
                        size={20}
                        onClick={() => {
                          setIsOpen(true);
                          let newArr = [...selected];
                          let index = newArr.indexOf(e);
                          newArr.splice(index, 1);
                          setSelected(newArr);
                          let arr = [...searchResults];
                          arr.push(e);
                          setSearchResults(arr);
                        }}
                      />
                    </Tag>
                  </SlideFade>
                );
              })}
            </HStack>

            {/* Members List */}
            {searchResults.map((e, i) => {
              return (
                <Container
                  // border="2px solid black"
                  height="auto"
                  borderRadius={10}
                  backgroundColor="hsl(0, 0%, 90%)"
                  padding="10px"
                  display="flex"
                  flexDirection="row"
                  cursor="pointer"
                  _hover={{
                    backgroundColor: "hsl(250, 50%, 85%)"
                  }}
                  onClick={() => {
                    let newArr = [...selected];
                    setIsOpen(true);
                    newArr.push(e);
                    setSelected(newArr);
                    let index = searchResults.indexOf(e);
                    let arr = [...searchResults];
                    arr.splice(index, 1);
                    setSearchResults(arr);
                  }}
                >
                  <Image
                    src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    height="35px"
                    style={{
                      aspectRatio: "1"
                    }}
                    borderRadius="100px"
                    border="1px solid black"
                    marginRight="10px"
                  ></Image>
                  <Text fontFamily="Barlow" fontWeight="500" fontSize="20px">
                    {e.name}
                  </Text>
                </Container>
              );
            })}
          </VStack>
          <FormControl id="profile" isRequired="false" marginTop="20px">
            <FormLabel fontFamily="Barlow" fontWeight="500">
              Group Profile
            </FormLabel>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => {
                setProfile(postDetails(e.target.files[0]));
              }}
              style={{ border: "none" }}
            />
          </FormControl>
        </Container>
        {/* Button Container */}
        <Container
          color="white"
          marginTop="30px"
          p="0"
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Button
            // rightIcon={<MdClose />}
            bg="hsl(0, 0%, 50%)"
            borderRadius="10px"
            _hover={{
              bg: "hsl(0, 0%, 50%)"
            }}
            onClick={() => {
              setName("");
              setMembers([]);
              setSelected([]);
              toast({
                title: "Form Cleared",
                status: "info",
                duration: 5000,
                isClosable: true
              });
            }}
          >
            <Text>Clear</Text>
          </Button>
          <Button
            rightIcon={<RiFolderAddFill />}
            borderRadius="10px"
            bg="#3F50A7"
            _hover={{
              bg: "#3F50A7"
            }}
            onClick={() => {
              createGroupChat(name, selected);
            }}
          >
            <Text>Create</Text>
          </Button>
        </Container>
      </Container>
    </>
  );
};

export default CreateGroupPannel;
