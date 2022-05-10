import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage"
import ReceptionPage from "./ReceptionPage"

const App: React.FC = () => (
    <Router>
        <Routes>
            <Route path={process.env.PUBLIC_URL} element={<HomePage />} />
            <Route path={`${process.env.PUBLIC_URL}/reception`} element={<ReceptionPage />} />
        </Routes>
    </Router>
)

export default App
