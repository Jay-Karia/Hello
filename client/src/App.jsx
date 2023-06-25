import "./App.css";

import { Container } from "@chakra-ui/react";
import Navbar from "./Components/Navbar";
import LoginRegister from "./Pages/LoginRegister";

import {
    BrowserRouter as Router,
    useRoutes,
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
                <Container>
                    <Routes>
                        <Route
                            exact
                            to="/(login|register)/"
                            component={<LoginRegister />}
                        />
                    </Routes>
                </Container>
            </Container>
        </div>
    );
}

export default App;
