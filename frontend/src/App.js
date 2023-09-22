import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import SendFile from "./components/SendFile";
import FileOperation from "./components/FileOperation";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/signup">Signup</Link></li>
                        <li><Link to="/signin">Signin</Link></li>
                        <li><Link to="/sendfile">Send File</Link></li>
                        <li><Link to="/fileoperation">File Operation</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/sendfile" element={<SendFile />} />
                    <Route path="/fileoperation" element={<FileOperation />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
