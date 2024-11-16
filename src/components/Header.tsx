import { Menu } from "primereact/menu";
import "../syles/header.css";

function Header() {
  return (
    <header className="header">
      <a href="/">
        <h1 className="title">WWSS</h1>
        <Menu />
      </a>
    </header>
  );
}

export default Header;
