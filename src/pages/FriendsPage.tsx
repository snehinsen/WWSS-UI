import Header from "../components/Header";
import Friends from "../components/user/Friends.tsx";

function FriendsPage() {
    return (
        <>
            <Header headerType="logged-in"/>
            <Friends />
        </>
    );
}

export default FriendsPage;
