import Feed from "../components/Feed";
import Header from "../components/Header";

function FeedPage() {
    return (
        <>
            <Header headerType="logged-in"/>
            <Feed/>
        </>
    );
}

export default FeedPage;
