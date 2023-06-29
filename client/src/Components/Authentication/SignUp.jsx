import React from "react";
import { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { VStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");

    const [emailValidate, setEmailValidate] = useState(false);
    const [passwordValidate, setPasswordValidate] = useState(false);
    const [cPassValidate, setCPassValidate] = useState(false);

    const [profile, setProfile] = useState("");

    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const validateEmail = () => {
        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const validate = re.test(email.toLowerCase());
        setEmailValidate(validate);
    };

    const validatePassword = (pass) => {
        const reg = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        const validateP = reg.test(pass.toLowerCase());
        setPasswordValidate(validateP);
    };

    const validateCPass = (e) => {
        if (e.target.value !== password) {
            setCPassValidate(false);
        } else {
            setCPassValidate(true);
        }
    };

    const postDetails = async(picture) => {
        setLoading(true);
        if (picture === undefined) {
            toast({
                title: "Please select image",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (picture.type === "image/jpg" || picture.type === "image/png") {
            const data = new FormData();
            data.append("file", picture);
            data.append("upload_preset", "hello-chat-app");
            data.append("cloud_name", "dkzytvwtx");
            console.log(data);
              axios
                .post("https://api.cloudinary.com/v1_1/dkzytvwtx", {
                  body: data
                })
                .then((res) => res.json())
                .then((data) => {
                  setProfile(data);
                  console.log(picture);
                  setLoading(false);
                })
                .catch((err) => {
                  console.error(err);
                });
        }
    };

    const navigate = useNavigate();

    const [show, setShow] = useState(false);

    const handleClick = () => {
        if (show === false) setShow(true);
        else setShow(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);
        // if (!name && !emailValidate && !passwordValidate && !cPassValidate) {}
        // console.log(emailValidate, passwordValidate, cPassValidate);
        if (!name || !email || !password || !confirmPassword) {
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
        } else if (!passwordValidate) {
            toast({
                title: "Password should atleast contain 6 characters",
                status: "error",
                duration: "5000",
                isClosable: true,
                position: "bottom",
            });
        } else if (!cPassValidate) {
            toast({
                title: "Password does not match",
                status: "error",
                duration: "5000",
                isClosable: true,
                position: "bottom",
            });
        } else {
            try {
                await axios
                    .post("http://localhost:8000/api/user/register", {
                        header: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            password,
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
                            window.location.reload()
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
            {/* Main Container */}
            {/* Form */}
            <VStack spacing="15px">
                <FormControl id="first-name" isRequired="true">
                    <FormLabel fontFamily="Barlow" fontWeight="500">
                        Name
                    </FormLabel>
                    <Input
                        onChange={(e) => {
                            setName(e.target.value);
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

                <FormControl id="email" isRequired="true">
                    <FormLabel fontFamily="Barlow" fontWeight="500">
                        Email
                    </FormLabel>
                    <Input
                        onChange={(e) => {
                            setEmail(e.target.value);
                            validateEmail();
                        }}
                        focusBorderColor="hsl(0, 0%, 80%)"
                        size="lg"
                        style={{
                            height: "45px",
                            fontSize: "15px",
                            borderRadius: "10px",
                            background: "hsl(0, 0%, 95%)",
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
                                validatePassword(e.target.value);
                            }}
                            type={show ? "text" : "password"}
                            focusBorderColor="hsl(0, 0%, 80%)"
                            size="lg"
                            style={{
                                height: "45px",
                                fontSize: "15px",
                                borderRadius: "10px",
                                background: "hsl(0, 0%, 95%)",
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

                <FormControl id="confirm-password" isRequired="true">
                    <FormLabel fontFamily="Barlow" fontWeight="500">
                        Confirm Password
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
                                setConfirmPassword(e.target.value);
                                validateCPass(e);
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

                <FormControl id="profile" isRequired="false">
                    <FormLabel fontFamily="Barlow" fontWeight="500">
                        Profile
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

                <Button
                    colorScheme="facebook"
                    onClick={(e) => {
                        handleSubmit(e);
                    }}
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
                    isLoading={loading}
                    rightIcon={<ArrowForwardIcon />}
                >
                    Register
                </Button>
            </VStack>
        </>
    );
};

export default SignUp;
