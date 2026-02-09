import { useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile.tsx";
import Header from "../components/Header";

function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  console.log("username from useParams:", username);
  console.log(useParams());
  return (
    <>
      <Header headerType="logged-in" />
      <UserProfile name={username || "none"} />
    </>
  );
}

export default ProfilePage;
