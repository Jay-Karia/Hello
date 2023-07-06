import React from "react";
import { Container, Text, Button, Image, Link } from "@chakra-ui/react";

import links from "../Panels/links.json";
import { AiOutlineArrowRight } from "react-icons/ai";

import { useNavigate } from "react-router-dom";

// Images
import source from "../assets/links/source.jpg";
import support from "../assets/links/support.jpg";
import rate from "../assets/links/rate.jpg";
import about from "../assets/links/about.jpg";
import share from "../assets/links/share.jpg";

const LinkPanel = () => {
  const images = [source, support, rate, about, share];

  const navigate = useNavigate()
  return (
    <>
      <Container w="100%" h="100%" p="0">
        <Container marginTop="20px" borderRadius="10px" bg="#e8b874" w="90%">
          <Text
            fontFamily="Arima"
            align="center"
            fontWeight="400"
            fontSize="30px"
          >
            Links
          </Text>
        </Container>
        <Container marginTop="40px">
          {/* Links Boxes */}
          {links.map((e, i) => {
            return (
              <>
                <Container
                  id={i}
                  border="2px solid black"
                  marginBottom="20px"
                  borderRadius="10px"
                  backgroundColor={e.bgcolor}
                  height="95px"
                  cursor="pointer"
                  transition="all 0.7s ease-in"
                  _hover={{
                    transition: "all 0.7s ease-in",
                    transform: "translateY(-10px)"
                  }}
                >
                  <Container
                    fontFamily="Barlow"
                    p="0"
                    display="flex"
                    flexDirection="row"
                    marginTop="5px"
                  >
                    <Text fontSize="20px" fontWeight="600">
                      {e.title}
                    </Text>
                    <Image
                      src={images[i]}
                      height="30px"
                      style={{
                        aspectRatio: "1"
                      }}
                      margin="2px 0 0 20px"
                    ></Image>
                  </Container>
                  <Text fontSize="15px" fontWeight="600" margin="5px 0 0 0" align="left">
                    {e.description}
                  </Text>
                  <Link href={e.link} target="_blank">
                    <AiOutlineArrowRight
                      style={{
                        position: "relative",
                        float: "right",
                        marginTop: "5px"
                      }}
                    />
                  </Link>
                </Container>
              </>
            );
          })}
        </Container>
      </Container>
    </>
  );
};

export default LinkPanel;
