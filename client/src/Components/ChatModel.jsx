import React, { useState } from 'react'

import axios from 'axios'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'

import { useDisclosure } from '@chakra-ui/hooks'
import {
  IconButton,
  Tag,
  TagLabel,
  HStack,
  SlideFade,
  Image,
  Container,
} from '@chakra-ui/react'

import {
  RiMore2Fill,
  RiPencilLine,
  RiUserSearchLine,
  RiCloseLine,
} from 'react-icons/ri'

import { Button } from '@chakra-ui/react'
import { confirmAlert } from 'react-confirm-alert'

import { Avatar } from '@chakra-ui/react'

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { chatActions } from './store'

const ChatModel = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isGroup = props.isGroupChat
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState([])
  const [selected, setSelected] = useState([])

  const [searchResults, setSearchResults] = useState([])

  const toast = useToast()

  const token = JSON.parse(localStorage.getItem('userInfo')).token

  const dispatch = useDispatch()
  const currentChat = useSelector((state) => state.chat)

  const getChats = async () => {
    setLoading(true)
    try {
      await fetch('http://localhost:8000/api/chat/', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          authorization: token,
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          setChats(data.results)
          localStorage.setItem('chats', JSON.stringify(chats))
          setLoading(false)
        })
    } catch (error) {
      toast({
        title: error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const accessChat = async (user, chatId) => {
    setLoading(true)
    try {
      let userId = ''
      if (user.length < 2) userId = user[0]._id
      // chat user is
      else userId = user[1]._id

      await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({ chatId: chatId, userId: userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('selectedChat', JSON.stringify(data))
          dispatch(chatActions.select(data))
          setLoading(false)
        })
    } catch (error) {
      toast({
        title: error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const renameGroup = async () => {
    const chatId = props.chat._id

    await fetch('http://localhost:8000/api/chat/group/rename', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        chatId: chatId,
        chatName: name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({
          title: data.msg,
          status: data.status,
          duration: 5000,
          isClosable: true,
        })
      })
  }

  const removeUser = async (user) => {
    const chatId = props.chat._id
    const userId = user._id
    await fetch('http://localhost:8000/api/chat/group/remove', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        chatId: chatId,
        user: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({
          title: data.msg,
          status: data.status,
          duration: 5000,
          isClosable: true,
        })
      })
  }

  const addUser = async () => {
    const chatId = props.chat._id
    let ids = []
    for (let i = 0; i < selected.length; i++) {
      ids[i] = selected[i]._id
    }

    await fetch('http://localhost:8000/api/chat/group/add', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        chatId: chatId,
        users: ids,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({
          title: data.msg,
          status: data.status,
          duration: 5000,
          isClosable: true,
        })
      })
  }

  const searchUser = async (search) => {
    // setLoading(true);
    try {
      await fetch(`http://localhost:8000/api/user/?search=${search}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data)
          // setLoading(false);
        })
    } catch (error) {
      toast({
        title: error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <IconButton
        variant="outline"
        colorScheme="white"
        border="0"
        icon={<RiMore2Fill size={25} />}
        right="0"
        position="absolute"
        onClick={onOpen}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          accessChat(props.chat.users, props.chat._id)
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader align="center" fontSize="30px" fontFamily="Barlow">
            {props.groupName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isGroup ? (
              <>
                <div class="users">
                  {props.users.map((e, i) => {
                    return (
                      <Tag
                        margin="5px"
                        id={i}
                        size="lg"
                        key="lg"
                        borderRadius="full"
                        variant="solid"
                        // colorScheme="green"
                        backgroundColor="hsl(200, 80%, 80%)"
                      >
                        <TagLabel>{e.name}</TagLabel>
                        <RiCloseLine
                          size={20}
                          onClick={() => {
                            removeUser(e)
                          }}
                        />
                      </Tag>
                    )
                  })}
                </div>
                <div class="rename-chat">
                  <InputGroup>
                    {/* <InputLeftElement pointerEvents="none"> */}
                    {/* <RiPencilFill color="gray.300" /> */}
                    <InputLeftAddon
                      backgroundColor="hsl(0, 0%, 90%)"
                      children={<RiPencilLine size="20px" color="gray.300" />}
                    />
                    {/* </InputLeftElement> */}
                    <Input
                      placeholder="Rename Group"
                      focusBorderColor="grey"
                      backgroundColor="hsl(0, 0%, 95%)"
                      onChange={(e) => {
                        setName(e.target.value)
                      }}
                    ></Input>
                    <InputRightAddon
                      children="Update"
                      cursor="pointer"
                      backgroundColor="purple.500"
                      fontWeight="500"
                      color="white"
                      onClick={() => {
                        renameGroup()
                      }}
                    />
                  </InputGroup>
                </div>
                <div class="add-users">
                  <InputGroup>
                    {/* <InputLeftElement pointerEvents="none"> */}
                    {/* <RiPencilFill color="gray.300" /> */}
                    <InputLeftAddon
                      backgroundColor="hsl(0, 0%, 90%)"
                      children={
                        <RiUserSearchLine size="20px" color="gray.300" />
                      }
                    />
                    {/* </InputLeftElement> */}
                    <Input
                      placeholder="Add Users"
                      focusBorderColor="grey"
                      backgroundColor="hsl(0, 0%, 95%)"
                      onChange={(e) => {
                        searchUser(e.target.value)
                      }}
                    ></Input>
                    <InputRightAddon
                      children="Add"
                      cursor="pointer"
                      backgroundColor="purple.500"
                      fontWeight="500"
                      color="white"
                      onClick={() => {
                        addUser()
                      }}
                    />
                  </InputGroup>
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
                                // setIsOpen(true);
                                let newArr = [...selected]
                                let index = newArr.indexOf(e)
                                newArr.splice(index, 1)
                                setSelected(newArr)
                                let arr = [...searchResults]
                                arr.push(e)
                                setSearchResults(arr)
                              }}
                            />
                          </Tag>
                        </SlideFade>
                      )
                    })}
                  </HStack>
                </div>
                <div class="search">
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
                          backgroundColor: 'hsl(250, 50%, 85%)',
                        }}
                        onClick={() => {
                          let newArr = [...selected]
                          // setIsOpen(true);
                          newArr.push(e)
                          setSelected(newArr)
                          let index = searchResults.indexOf(e)
                          let arr = [...searchResults]
                          arr.splice(index, 1)
                          setSearchResults(arr)
                        }}
                      >
                        <Avatar name={e.name} size="sm" marginRight={'10px'} />
                        <Text
                          fontFamily="Barlow"
                          fontWeight="500"
                          fontSize="20px"
                        >
                          {e.name}
                        </Text>
                      </Container>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <div class="avatar">
                  <Avatar name={props.chat.users[1].name} size="xl" />
                </div>

                <div class="email">
                  <Text
                    align="center"
                    fontFamily="Inter"
                    fontWeight={300}
                    fontSize="20px"
                    lineHeight="25px"
                  >
                    {props.chat.users[1].email}
                  </Text>
                </div>
              </>
            )}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChatModel
