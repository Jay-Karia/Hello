import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import SignIn from "../Components/Authentication/Signin.jsx";
import SignUp from "../Components/Authentication/SignUp.jsx";

const LoginRegister = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo) {
            navigate("/chats");
        }
    }, [navigate]);

    return (
        <>
            <Container
                maxWidth="100vw"
                style={{
                    background: "white",
                    height: "16.5cm",
                    width: "25cm",
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: "10px",
                    padding: "0",
                    // boxShadow: "0 0 5px 2px #adadad"
                }}
            >
                {/* Image Container */}
                <Container
                    maxWidth="100vw"
                    style={{
                        height: "auto",
                        width: "20cm",
                        padding: "0",
                        margin: "0",
                        backgroundImage: `url("https://png.pngtree.com/thumb_back/fw800/background/20190828/pngtree-purple-abstract-paper-cut-background-image_308826.jpg")`,
                        borderRadius: "10px 0 0 10px",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                    }}
                >
                    {/* Text Container */}
                    <Container
                        style={{
                            marginTop: "14.3cm",
                            padding: "0",
                            paddingBottom: "20px",
                            paddingLeft: "10px",
                        }}
                    >
                        <Text
                            fontFamily="Anuphan"
                            color="white"
                            fontWeight="200"
                            fontSize="25px"
                            letterSpacing="2px"
                            align="left"
                        >
                            Welcome To
                        </Text>
                        <Text
                            fontFamily="Anuphan"
                            color="white"
                            fontWeight="400"
                            fontSize="25px"
                            letterSpacing="2px"
                            align="left"
                        >
                            <i>Hello</i>
                        </Text>
                    </Container>
                </Container>
                {/* Form Container */}
                <Container
                    maxWidth="100vw"
                    style={{
                        background: "white",
                        width: "25cm",
                        borderRadius: "0 10px 10px 0",
                        height: "auto",
                        display: "flex",
                        justifyContent: "center",
                        padding: "10px",
                    }}
                >
                    <Tabs
                        variant="soft-rounded"
                        colorScheme="purple"
                        size="md"
                        isFitted="true"
                        style={{
                            width: "75%",
                        }}
                    >
                        <TabList mb="1em" style={{ paddingTop: "10px" }}>
                            <Tab>Login</Tab>
                            <Tab>Register</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <SignIn />
                            </TabPanel>
                            <TabPanel>
                                <SignUp />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Container>
            </Container>
        </>
    );
};

export default LoginRegister;
