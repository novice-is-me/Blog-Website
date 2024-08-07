// AppNavbar.jsx
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { TokenContext } from '../App';


const AppNavbar = () => {
    const { token } = useContext(TokenContext);

    return (
        <Navbar expand="lg" className="bg-dark-subtle">
            <Container>
                <Navbar.Brand as={Link} to="/" className='d-flex me-auto fs-2 align-items-center'>
                    Blog Beacon
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {token ? (
                            <Nav.Link as={Link} to="/logout" className='fs-3'>Logout</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login" exact="true" className='fs-4 me-3'>Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register" exact="true" className='fs-4'>Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
