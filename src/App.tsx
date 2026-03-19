import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import "./syles/App.css";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import SetupPage from "./pages/SetupPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

function App() {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<SignupPage/>}/>
                <Route path="/app/feed" element={<FeedPage/>}/>
                <Route path="/app/profile/:username" element={<ProfilePage/>}/>
                <Route path="/setup" element={<SetupPage/>}/>
                <Route path="/app/settings" element={<SettingsPage />}/>
            </Routes>
        </Router>
    );
}

export default App;
