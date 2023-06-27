import React, { useState } from "react";

import { Box, Tooltip, Container } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import { useMediaQuery } from "@chakra-ui/react";

import {
  RiChat4Fill,
  RiChat4Line,
  RiNotification2Fill,
  RiNotification2Line,
  RiSearch2Fill,
  RiSearch2Line,
  RiAddFill,
  RiAddLine,
  RiLinksFill,
  RiLinksLine
} from "react-icons/ri";

import ChatPannel from "./Panels/ChatPanel";
import SearchPannel from "./Panels/SearchPanel";
import CreateGroupPannel from "./Panels/CreateGroupPanel";
import LinkPanel from "./Panels/LinksPanel";

const SideBar = () => {
  const [selected, setSelected] = useState({
    chat: true,
    bell: false,
    search: false,
    add: false,
    links: false
  });

  const [isMobile] = useMediaQuery("(max-width: 1000px)");

  return (
    <>
      <Container
        marginLeft={0}
        d="flex"
        width="15cm"
        h="auto"
        borderRight="1px solid black"
        paddingLeft="0"
        // maxWidth="15cm"
      >
        <Tabs orientation="vertical" h="95vh" variant="unstyled">
          <TabList
            p="0"
            m="0"
            w="50px"
            h="100%"
            style={{
              display: "flex",
              background: "#261F35",
              color: "white"
            }}
          >
            <Tab
              onClick={() => {
                setSelected({
                  chat: true,
                  bell: false,
                  search: false,
                  add: false,
                  links: false
                });
              }}
              style={{
                padding: "9px",
                aspectRatio: "1",
                margin: "5px"
              }}
              _selected={{
                background: "purple.600",
                borderRadius: "10px"
              }}
            >
              {selected.chat ? (
                <RiChat4Fill size={25} />
              ) : (
                <RiChat4Line size={25} />
              )}
            </Tab>
            <Tab
              onClick={() => {
                setSelected({
                  chat: false,
                  bell: false,
                  search: true,
                  add: false,
                  links: false
                });
              }}
              style={{
                padding: "9px",
                aspectRatio: "1",
                margin: "5px"
              }}
              _selected={{
                background: "purple.600",
                borderRadius: "10px"
              }}
            >
              {selected.search ? (
                <RiSearch2Fill size={25} />
              ) : (
                <RiSearch2Line size={25} />
              )}
            </Tab>
            <Tab
              onClick={() => {
                setSelected({
                  chat: false,
                  bell: false,
                  search: false,
                  add: true,
                  links: false
                });
              }}
              style={{
                padding: "9px",
                aspectRatio: "1",
                margin: "5px"
              }}
              _selected={{
                background: "purple.600",
                borderRadius: "10px"
              }}
            >
              {selected.add ? <RiAddFill size={25} /> : <RiAddLine size={25} />}
            </Tab>
            <Tab
              onClick={() => {
                setSelected({
                  chat: false,
                  bell: false,
                  search: false,
                  add: false,
                  links: true
                });
              }}
              style={{
                padding: "9px",
                aspectRatio: "1",
                margin: "5px"
              }}
              _selected={{
                background: "purple.600",
                borderRadius: "10px"
              }}
            >
              {selected.links ? (
                <RiLinksFill size={25} />
              ) : (
                <RiLinksLine size={25} />
              )}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel m="0" p="0">
              <ChatPannel />
            </TabPanel>
            <TabPanel m="0" p="0">
              <SearchPannel />
            </TabPanel>
            <TabPanel m="0" p="0">
              <CreateGroupPannel />
            </TabPanel>
            <TabPanel m="0" p="0">
              <LinkPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default SideBar;
