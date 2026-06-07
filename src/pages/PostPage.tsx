import {useParams} from "react-router-dom";
import Header from "../components/Header";
import PostScreen from "../components/PostMedia/PostScreen.tsx";

function PostPage() {
    const {pid} = useParams<{ pid: string }>();
    console.log(pid);
    return (
        <>
            <Header headerType="logged-in"/>
            <PostScreen postId={Number(pid) || null}/>
        </>
    );
}

export default PostPage;
