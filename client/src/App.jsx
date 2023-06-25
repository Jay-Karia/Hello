import "./App.css";

import { Container } from "@chakra-ui/react";
import Navbar from "./Components/Navbar";
import LoginRegister from "./Pages/LoginRegister";

function App() {
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
                <LoginRegister />
            </Container>
        </div>
    );
}

export default App;
