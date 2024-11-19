import React, { useState } from "react";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import "../syles/header.css";

interface Props {
  headerType: string;
}

function Header({ headerType }: Props) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (headerType === "landing") {
    return (
      <>
        <header className="header">
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
  } else if (headerType === "logged-in") {
    return (
      <>
        <header className="header logged-in" id="header">
          <Button
            icon="pi pi-bars"
            className="menuButton"
            id="menubutton"
            onClick={toggleSidebar}
          />
          <a href="/feed">
            <h1 className="title">WWSS</h1>
          </a>
        </header>

        <Sidebar
          visible={isSidebarVisible}
          onHide={toggleSidebar}
          position="left"
          className="p-sidebar-lg"
        >
          <a onClick={toggleSidebar}>
            <h1 className="title">WWSS</h1>
          </a>
          <h3>Menu</h3>
          <nav>
            <a href="/feed" className="sidebar-link">
              Feed
            </a>
            <a href="/dms" className="sidebar-link">
              Your DMs
            </a>
            <a href="/profile/harrypotter" className="sidebar-link">
              Your Profile
            </a>
          </nav>
        </Sidebar>
      </>
    );
  }

  return null;
}

export default Header;
