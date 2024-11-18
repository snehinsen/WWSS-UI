import { Button } from "primereact/button";
import "../syles/header.css";

interface Props {
  headerType: string;
}

function Header({ headerType }: Props) {
  function toggleSidebar() {
    const header = document.getElementById("header");
    header?.classList.toggle("shown");
  }
  if (headerType == "landing") {
    return (
      <>
        {window.innerWidth <= 999 ? (
          <>
            <Button
              icon="pi pi-menu"
              label="show sidebar"
              className="menuButton"
              id="menubutton"
              onClick={toggleSidebar()}
            />
          </>
        ) : null}
        <header className="header" id="header">
          <a href="/">
            <h1 className="title">WWSS</h1>
          </a>
          <nav>
            <a href="/product">Product</a>
            <a href="/about">About Us</a>
          </nav>
        </header>
      </>
    );
  } else if (headerType == "logged-in") {
    return (
      <header className="header">
        <a href="/feed">
          <h1 className="title">WWSS</h1>
        </a>
        <nav>
          <a href="/feed">Feed</a>
          <a href="/dms">your DMs</a>
          <a href="/profile/harrypotter">your Profile</a>
        </nav>
      </header>
    );
  }
}

export default Header;
