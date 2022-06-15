import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import CreateAlert from './../CreateAlert';

export default class LandingPage extends Component {

    render() {
        return (
            <div className="landing-page-wrapper">
                <Container className="d-flex justify-content-center flex-column">
                    <CreateAlert />
                </Container>
            </div>
        );
    }
} 
