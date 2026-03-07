import Header from "../components/Header.tsx";
import Signup from "../components/Signup.tsx";

function SignupPage() {

    return (
        <>
            <Header headerType="logged-in"/>
            <Signup/>
        </>
    );
}

export default SignupPage;
