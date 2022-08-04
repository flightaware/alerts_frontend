import React, {Component} from 'react';
import {Navbar, Nav} from 'react-bootstrap';

export default class AppNavbar extends Component {
    render() {
        return (
            <Navbar bg="light" sticky="top" expand="lg">
                <Navbar.Brand href="/">FlightAware Alert Creation</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/alert_configs">Alert Configurations</Nav.Link>
                        <Nav.Link href="/posted_alerts">Posted Alerts</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
