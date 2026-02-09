import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import "./syles/App.css";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import Setup from "./pages/Setup.tsx";

function App() {
    return (
        <Router basename="/app">
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/feed" element={<FeedPage/>}/>
                <Route path="/profile/:username" element={<ProfilePage/>}/>
                <Route path="/setup" element={<Setup />} />
            </Routes>
        </Router>
    );
}

export default App;
