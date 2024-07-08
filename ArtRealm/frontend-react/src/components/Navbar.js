// NavigationBar.jsx

import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Import your CSS file

const NavigationBar = () => {
  const query = new URLSearchParams(useLocation().search);
  const userId = query.get('userId');

  return (
    <Navbar bg="" variant="" expand="lg" className='navbar'>
      <Container>
      <div className="navBarTitle">Art Realm</div>
      <div className="navBarSubtitle">Virtual Showcase</div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="links">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to={`/profile?userId=${userId}`}>Profile</Nav.Link>
            <Nav.Link as={Link} to="/auction">Auction</Nav.Link>
            <Nav.Link as={Link} to="/">Logout</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
