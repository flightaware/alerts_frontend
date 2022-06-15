import React, {Component} from 'react';
import {Container} from 'react-bootstrap';
import axios from 'axios';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"

export default class CreateAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ident: '',
            origin: '',
            destination: '',
            aircraft_type: null,
            start: new Date(),
            end: new Date()
        }
    }

    handleIdentChange = (event) => {
        this.setState({ident: event.target.value});
    }

    handleOriginChange = (event) => {
        this.setState({origin: event.target.value});
    }

    handleDestinationChange = (event) => {
        this.setState({destination: event.target.value});
    }

    handleAircraftChange = (event) => {
        this.setState({aircraft_type: event.target.value});
    }

    handleStartChange = (date) => {
        this.setState({start: date});
    }

    handleEndChange = (date) => {
        this.setState({end: date});
    }

    handleSubmit = (event) => {
        alert('Submitted form');
        event.preventDefault();
        // const test_data = {
        //     origin: "ORD",
        //     destination: "GRB",
        //     start: "2022-06-20",
        //     end: "2022-06-25",
        //     ident: "N763CC",
        // };
        const processed_data = {
            ident: this.state.ident,
            origin: this.state.origin,
            destination: this.state.destination,
            aircraft_type: this.state.aircraft_type,
            start: this.state.start.toISOString().split('T')[0],
            end: this.state.end.toISOString().split('T')[0],
        };
        axios.post('/api/create', JSON.stringify(processed_data),
        ).then(response => {
            console.log("Sent JSON payload to backend successfully: " + response.data)
        }).catch(error => {
            console.error("Error occurred in sending JSON payload to backend: " + error)
        });

    };

    render() {
        return (
            <div>
                <Container>
                    <label>
                        <b>Create an Alert</b>
                    </label>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Ident:
                            <input type="text" value={this.state.ident} onChange={this.handleIdentChange}/>
                        </label>
                        <label>
                            Origin:
                            <input type="text" value={this.state.origin} onChange={this.handleOriginChange}/>
                        </label>
                        <label>
                            Destination:
                            <input type="text" value={this.state.destination} onChange={this.handleDestinationChange}/>
                        </label>
                        <label>
                            Aircraft Type:
                            <input type="text" value={this.state.aircraft_type} onChange={this.handleAircraftChange}/>
                        </label>
                        <label>
                            Start Date:
                            <DatePicker dateFormat="yyyy/MM/dd" selected={this.state.start}
                                        onChange={this.handleStartChange}/>
                        </label>
                        <label>
                            End Date:
                            <DatePicker dateFormat="yyyy/MM/dd" selected={this.state.end}
                                        onChange={this.handleEndChange}/>
                        </label>
                        <br/>
                        <input type="submit" value="Create Alert"/>
                    </form>
                </Container>
            </div>
        );
    }
}