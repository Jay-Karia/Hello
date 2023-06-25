import React from "react";

import { Container } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";

const Navbar = () => {
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
            </Container>
        </>
    );
};

export default Navbar;
