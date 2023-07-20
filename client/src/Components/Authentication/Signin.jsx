import React from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { VStack, useToast } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import axios from "axios";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailValidate, setEmailValidate] = useState(false);
    const toast = useToast();

    const validateEmail = (email) => {
        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const validate = re.test(email.toLowerCase());
        setEmailValidate(validate);
    };

    const [show, setShow] = useState(false);

    const handleClick = () => {
        if (show === false) setShow(true);
        else setShow(false);
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "Please fill out the details",
                status: "error",
                duration: "5000",
                isClosable: true,
                position: "bottom",
            });
        } else if (!emailValidate) {
            toast({
                title: "Enter a valid email",
                status: "error",
                duration: "5000",
                isClosable: true,
                position: "bottom",
            });
        } else {
            try {
                await axios
                    .post("https://hello-chat-app-kappa.vercel.app/api/user/login", {
                        header: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                        }),
                    })
                    .then((response) => {
                        response = response.data;
                        toast({
                            title: response.msg,
                            status: response.status,
                            duration: "5000",
                            isClosable: true,
                            position: "bottom",
                        });
                        if (response.status === "success") {
                            navigate("/chats");
                            console.log(response)
                            window.location.reload();
                            localStorage.setItem(
                                "userInfo",
                                JSON.stringify(response)
                            );
                        }
                    })
                    .catch((response) => {
                        let data = response.response.data;
                        toast({
                            title: data.msg,
                            status: data.status,
                            duration: "5000",
                            isClosable: true,
                            position: "bottom",
                        });
                    });
            } catch {}
        }
    };

    return (
        <>
            <VStack spacing="15px">
                <FormControl id="email" isRequired="true">
                    <FormLabel fontFamily="Barlow" fontWeight="500">
                        Email
                    </FormLabel>
                    <Input
                        onChange={(e) => {
                            setEmail(e.target.value);
                            validateEmail(e.target.value)
                        }}
                        focusBorderColor="hsl(0, 0%, 80%)"
                        size="lg"
                        style={{
                            height: "45px",
                            fontSize: "15px",
                            borderRadius: "10px",
                            background: "hsl(0, 0%, 95%)",
                            "&:active": {
                                boxShadow: " 0 0 1px 1px grey",
                                outline: "2px solid black",
                                outlineOffset: "4px",
                            },
                        }}
                    />
                </FormControl>

                <FormControl id="password" isRequired="true">
                    <FormLabel fontFamily="Barlow" fontWeight="500">
                        Password
                    </FormLabel>
                    <InputGroup
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Input
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            type={show ? "text" : "password"}
                            focusBorderColor="hsl(0, 0%, 80%)"
                            size="lg"
                            style={{
                                height: "45px",
                                fontSize: "15px",
                                borderRadius: "10px",
                                background: "hsl(0, 0%, 95%)",
                                "&:active": {
                                    boxShadow: " 0 0 1px 1px grey",
                                    outline: "2px solid black",
                                    outlineOffset: "4px",
                                },
                            }}
                        />
                        <InputRightElement>
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                                {show ? (
                                    <ViewIcon
                                        boxSize={5}
                                        style={{
                                            marginTop: "4px",
                                            marginRight: "2px",
                                        }}
                                    />
                                ) : (
                                    <ViewOffIcon
                                        boxSize={5}
                                        style={{
                                            marginTop: "4px",
                                            marginRight: "2px",
                                        }}
                                    />
                                )}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button
                    colorScheme="facebook"
                    // onClick={handleSubmit}
                    onClick={(e)=> {handleSubmit(e)}}
                    style={{
                        marginTop: "30px",
                        borderRadius: "100px",
                        width: "50%",
                        backgroundImage:
                            "url('https://static.vecteezy.com/system/resources/thumbnails/002/317/745/small/abstract-geometric-purple-background-free-vector.jpg')",
                        transition: "all 0.5s ease-in",
                    }}
                    _hover={{
                        transform: "translateY(-5px)",
                        transition: "all .5s ease-out",
                    }}
                    rightIcon={<ArrowForwardIcon />}
                >
                    Login
                </Button>
            </VStack>
        </>
    );
};

export default SignIn;
