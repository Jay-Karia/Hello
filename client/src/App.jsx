import "./App.css";

import { Container } from "@chakra-ui/react";
import Navbar from "./Components/Navbar";
import LoginRegister from "./Pages/LoginRegister";
import ChatPage from "./Pages/ChatPage";

import {
    Routes,
    Route,
} from "react-router-dom";

function App() {
    // const elem = <LoginRegister />
    // useRoutes(['/login', '/register', '/'].map(path => ({path, elem})));
    return (
        <div className="App">
            <Navbar />
            <Container
                maxWidth="100vw"
                style={{
                    height: "94.8vh",
                    background: "#664e78",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0",
                    boxSizing: "border-box",
                    scrollBehavior: "unset",
                }}
            >
                    {/* <LoginRegister /> */}
                    <Routes>
                        <Route exact path="/login" element={<LoginRegister />} />
                        <Route exact path="/register" element={<LoginRegister />} />
                        <Route exact path="/" element={<LoginRegister />} />
                        <Route exact path="/chats" element={<ChatPage/>} />
                    </Routes>
            </Container>
        </div>
    );
}

export default App;
