import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { Container, Text } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'

import { useDisclosure } from '@chakra-ui/hooks'

import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const userInfo = JSON.parse(localStorage.getItem('userInfo')).user

  const [showProfile, setShowProfile] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const logout = () => {
    localStorage.clear()
    navigate('/login')
    window.location.reload()
  }

  useEffect(() => {
    let user = localStorage.userInfo
    if (user) {
      setIsLoggedIn(true)
      user = JSON.parse(user).user
      setName(user.name)
    } else setIsLoggedIn(false)
  }, [isLoggedIn])
  return (
    <>
      <Container
        maxWidth="100vw"
        style={{
          backgroundColor: '#664e78',
          height: '50px',
          display: 'flex',
          // justifyContent: "center",
          alignItems: 'center',
        }}
      >
        <Link
          href="/"
          fontFamily="Inter"
          fontWeight="100"
          fontSize="35px"
          color="white"
          style={{ textDecoration: 'none' }}
        >
          <i>Hello</i>
        </Link>
        {isLoggedIn ? (
          <>
            <Text
              fontFamily="Inter"
              fontWeight="100"
              fontSize="15px"
              color="white"
              style={{
                textDecoration: 'none',
                position: 'absolute',
                right: '80px',
              }}
              onClick={logout}
              cursor="pointer"
            >
              Logout
            </Text>
            <Avatar
              name={name}
              size="sm"
              onClick={() => {
                setShowProfile(true)
                onOpen()
              }}
              style={{
                textDecoration: 'none',
                position: 'absolute',
                right: '20px',
                cursor: 'pointer',
              }}
            />
            <Modal
              isOpen={isOpen}
              onClose={() => {
                onClose()
              }}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader align="center" fontSize="30px" fontFamily="Inter">
                  {name}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody align="center">
                  <Avatar name={userInfo.name} size="xl" style={{marginBottom:"20px"}}/>
                  <Text fontFamily="Inter" fontWeight="300" fontSize="20px">
                    {userInfo.email}
                  </Text>
                </ModalBody>

                <ModalFooter></ModalFooter>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <>
            <Link
              href="/register"
              fontFamily="Inter"
              fontWeight="100"
              fontSize="15px"
              color="white"
              style={{
                textDecoration: 'none',
                position: 'absolute',
                right: '20px',
              }}
            >
              Register
            </Link>
            <Link
              href="/login"
              fontFamily="Inter"
              fontWeight="100"
              fontSize="15px"
              color="white"
              style={{
                textDecoration: 'none',
                position: 'absolute',
                right: '100px',
              }}
            >
              Login
            </Link>
          </>
        )}
      </Container>
    </>
  )
}

export default Navbar
