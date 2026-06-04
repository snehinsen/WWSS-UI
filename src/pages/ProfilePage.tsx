import {useParams} from "react-router-dom";
import UserProfile from "../components/user/UserProfile.tsx";
import Header from "../components/Header";

function ProfilePage() {
    const {username} = useParams<{ username: string }>();
    console.log(username);
    return (
        <>
            <Header headerType="logged-in"/>
            <UserProfile name={username || "none"}/>
        </>
    );
}

export default ProfilePage;
