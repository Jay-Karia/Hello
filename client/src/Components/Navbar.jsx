import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Container, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    };

    useEffect(() => {
        const user = localStorage.getItem("userInfo");
        if (user) setIsLoggedIn(true);
        else setIsLoggedIn(false);
    }, [isLoggedIn]);
    return (
        <>
            <Container
                maxWidth="100vw"
                style={{
                    backgroundColor: "#664e78",
                    height: "50px",
                    display: "flex",
                    // justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Link
                    href="/"
                    fontFamily="Inter"
                    fontWeight="100"
                    fontSize="35px"
                    color="white"
                    style={{ textDecoration: "none" }}
                >
                    <i>Hello</i>
                </Link>
                {isLoggedIn ? (
                    <Text
                        fontFamily="Inter"
                        fontWeight="100"
                        fontSize="15px"
                        color="white"
                        style={{
                            textDecoration: "none",
                            position: "absolute",
                            right: "20px",
                        }}
                        onClick={logout}
                        cursor="pointer"
                    >
                        Logout
                    </Text>
                ) : (
                    <>
                        <Link
                            href="/register"
                            fontFamily="Inter"
                            fontWeight="100"
                            fontSize="15px"
                            color="white"
                            style={{
                                textDecoration: "none",
                                position: "absolute",
                                right: "20px",
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
                                textDecoration: "none",
                                position: "absolute",
                                right: "100px",
                            }}
                        >
                            Login
                        </Link>
                    </>
                )}
            </Container>
        </>
    );
};

export default Navbar;
