import React, { useEffect, useState } from 'react'

import ScrollableFeed from 'react-scrollable-feed'
import { Container, Text, Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ messages, user }) => {
  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    )
  }

  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    )
  }

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    // Add event listener to handle window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* <ScrollableFeed> */}
      <div style={{ height: windowHeight*80.5/100, overflowY: 'hidden'}}>
        {messages &&
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
                        ? '0' + new Date(e.updatedAt).getMinutes()
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
                        ? ''
                        : '30px',
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
                        mt="7px"
                        nr={1}
                        size="sm"
                        cursor="pointer"
                        name={e.sender.name}
                        border="1px solid black"
                      ></Avatar>
                    </Tooltip>
                  ) : (
                    ''
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
                        ? '0' + new Date(e.updatedAt).getMinutes()
                        : new Date(e.updatedAt).getMinutes()}
                    </Text>
                  </Container>
                </div>
              )
            ) : (
              ''
            )
          })}
      {/* </ScrollableFeed> */}
      </div>
    </>
  )
}

export default ScrollableChat
