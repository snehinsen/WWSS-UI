import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import "./syles/App.css";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import SetupPage from "./pages/SetupPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import FriendsPage from "./pages/FriendsPage.tsx";
import DMsPage from "./pages/DMsPage.tsx";
import PostPage from "./pages/PostPage.tsx";
import {useUserContext} from "./context/userContext.tsx";

function App() {

    const {loading, user} = useUserContext();

    if (!loading && user) {
        if (!user!!.isSetup && window.location.pathname !== "/setup") {
            window.location.href = "/setup";
        }
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<SignupPage/>}/>
                <Route path="/app/feed" element={<FeedPage/>}/>
                <Route path="/app/profile/:username" element={<ProfilePage/>}/>
                <Route path="/app/settings" element={<SettingsPage />}/>
                <Route path="/app/friends" element={<FriendsPage />}/>
                <Route path="/app/dms" element={<DMsPage />}/>
                <Route path="/app/post/:pid" element={<PostPage />}/>
                <Route path="/setup" element={<SetupPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
