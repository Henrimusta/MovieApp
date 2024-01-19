import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const NotificationDropdown = () => {
  // Replace this with your actual notification data or logic
  const notifications = [];

  return (
    <NavDropdown title="Notifications" id="basic-nav-dropdown">
      {notifications.map((notification) => (
        <NavDropdown.Item key={notification.id}>
          {notification.text}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

const NotificationBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Your Logo</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
        </Nav>
        <NotificationDropdown />
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NotificationBar;
