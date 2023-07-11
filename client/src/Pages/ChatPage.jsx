import React, { useEffect } from 'react'

import { Box } from '@chakra-ui/react'

import SideBar from '../Components/SideBar'
import ChatArea from '../Components/ChatArea'

import { useNavigate } from 'react-router-dom'

const ChatPage = () => {
  const navigate = useNavigate()

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  useEffect(() => {

    if (!userInfo) {
      navigate('/login')
    } 
  }, [])

  return (
    <div
      style={{
        width: '100%',
        background: 'white',
        height: '100%',
        padding: '0',
        margin: '0',
      }}
    >
      <Box
        style={{
          display: 'flex',
        }}
      >
      {userInfo && <><SideBar />
        <ChatArea /></>}
        
      </Box>
    </div>
  )
}

export default ChatPage
