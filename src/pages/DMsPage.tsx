import Header from "../components/Header";
import DMs from "../components/user/DMs.tsx";

function DMsPage() {
    return (
        <>
            <Header headerType="logged-in"/>
            <DMs/>
        </>
    );
}

export default DMsPage;
