import { Menu } from "primereact/menu";
import "../syles/header.css";

function Header() {
  return (
    <header className="header">
      <a href="/feed">
        <h1 className="title">WWSS</h1>
        <nav>
          <a href="/feed">Feed</a>
          <a href="/dms">your DMs</a>
          <a href="/profile/harrypotter">your Profile</a>
        </nav>
      </a>
    </header>
  );
}

export default Header;
