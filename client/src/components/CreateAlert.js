import React, {Component} from 'react';
import {Container} from 'react-bootstrap';
import axios from 'axios';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"

export default class CreateAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            buttonDisabled: false,
            dateValid: true,
            etaValid: true,
            ident: '',
            origin: '',
            destination: '',
            aircraftType: null,
            start: new Date(),
            end: new Date(),
            events: {
                arrival: false,
                cancelled: false,
                departure: false,
                diverted: false,
                filed: false
            },
            eta: 15,
            max_weekly: 1000
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
        this.setState({aircraftType: event.target.value});
    }

    handleStartChange = (date) => {
        this.setState({start: date})
        if (date.getTime() > this.state.end.getTime()) {
            this.setState({buttonDisabled: true});
            this.setState({dateValid: false});
        } else {
            this.setState({buttonDisabled: false});
            this.setState({dateValid: true});
        }
    }

    handleEndChange = (date) => {
        this.setState({end: date})
        if (date.getTime() < this.state.start.getTime()) {
            this.setState({buttonDisabled: true});
            this.setState({dateValid: false});
        } else {
            this.setState({buttonDisabled: false});
            this.setState({dateValid: true});
        }
    }

    handleArrivalEventChange = (event) => {
        let newEvents = {...this.state.events};
        newEvents.arrival = event.target.checked;
        this.setState({events: newEvents});
    }

    handleCancelledEventChange = (event) => {
        let newEvents = {...this.state.events};
        newEvents.cancelled = event.target.checked;
        this.setState({events: newEvents});
    }

    handleDepartureEventChange = (event) => {
        let newEvents = {...this.state.events};
        newEvents.departure = event.target.checked;
        this.setState({events: newEvents});
    }

    handleDivertedEventChange = (event) => {
        let newEvents = {...this.state.events};
        newEvents.diverted = event.target.checked;
        this.setState({events: newEvents});
    }

    handleFiledEventChange = (event) => {
        let newEvents = {...this.state.events};
        newEvents.filed = event.target.checked;
        this.setState({events: newEvents});
    }

    handleETAChange = (event) => {
        this.setState({eta: event.target.value});
        if (event.target.value % 15 !== 0) {
            this.setState({buttonDisabled: true});
            this.setState({etaValid: false});
        } else {
            this.setState({buttonDisabled: false});
            this.setState({etaValid: true});
        }
    }

    handleMaxWeeklyChange = (event) => {
        this.setState({max_weekly: event.target.value});
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
        const processedData = {
            ident: this.state.ident,
            origin: this.state.origin,
            destination: this.state.destination,
            aircraft_type: this.state.aircraftType,
            start: this.state.start.toISOString().split('T')[0],
            end: this.state.end.toISOString().split('T')[0],
            events: this.state.events,
            eta: parseInt(this.state.eta),
            max_weekly: parseInt(this.state.max_weekly),
        };
        axios.post('/api/create', JSON.stringify(processedData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            console.log("Sent JSON payload to backend successfully: " + response.data);
            this.setState({response: response.data["Description"]});
        }).catch(error => {
            console.error("Error occurred in sending JSON payload to backend: " + error);
            this.setState({response: error.data["Description"]});
        });

    };

    render() {
        return (
            <div className="container m-3">
                <Container className="mt-3 d-flex justify-content-center align-items-center flex-column">
                    <h2>Create an Alert</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label className="col-form-label">Ident:</label>
                            <input className="form-control" type="text" value={this.state.ident}
                                   placeholder="e.g. N763CC"
                                   onChange={this.handleIdentChange}/>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label">Origin:</label>
                            <input type="text" className="form-control" value={this.state.origin} placeholder="e.g. ORD"
                                   onChange={this.handleOriginChange}/>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label">Destination:</label>
                            <input type="text" className="form-control" value={this.state.destination}
                                   placeholder="e.g. GRB"
                                   onChange={this.handleDestinationChange}/>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label">Aircraft Type:</label>
                            <input type="text" className="form-control" value={this.state.aircraftType}
                                   placeholder="e.g. E170"
                                   onChange={this.handleAircraftChange}/>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label">Start Date:</label>
                            <DatePicker dateFormat="yyyy/MM/dd" selected={this.state.start}
                                        onChange={this.handleStartChange}/>
                            {!this.state.dateValid && <div className="form-text" style={{color: "red"}}>
                                Dates are invalid, disabling button
                            </div>}
                        </div>
                        <div className="form-group">
                            <label className="col-form-label">End Date:</label>
                            <DatePicker dateFormat="yyyy/MM/dd" selected={this.state.end}
                                        onChange={this.handleEndChange}/>
                            {!this.state.dateValid && <div className="form-text" style={{color: "red"}}>
                                Dates are invalid, disabling button
                            </div>}
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-2">Events</div>
                            <div className="col-sm-10">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.events.arrival}
                                        onChange={this.handleArrivalEventChange}
                                    />
                                    <label className="form-check-label">Arrival</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.events.cancelled}
                                        onChange={this.handleCancelledEventChange}
                                    />
                                    <label className="form-check-label">Cancelled</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.events.departure}
                                        onChange={this.handleDepartureEventChange}
                                    />
                                    <label className="form-check-label">Departure</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.events.diverted}
                                        onChange={this.handleDivertedEventChange}
                                    />
                                    <label className="form-check-label">Diverted</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={this.state.events.filed}
                                        onChange={this.handleFiledEventChange}
                                    />
                                    <label className="form-check-label">Filed</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label">
                                ETA (Minutes before flight's ETA to be delivered):</label>
                            <input type="number" className="form-control" value={this.state.eta}
                                   onChange={this.handleETAChange}/>
                            {!this.state.etaValid && <div className="form-text" style={{color: "red"}}>
                                ETA value must be a multiple of 15 (0 to disable), disabling button until it is
                                changed
                            </div>}
                        </div>
                        <div className="form-group">
                            <label className="col-form-label">Max Weekly</label>
                            <input type="number" className="form-control" value={this.state.max_weekly}
                                   onChange={this.handleMaxWeeklyChange}/>
                            {this.state.max_weekly > 1000 && <div className="form-text text-muted">
                                Max weekly cannot be greater than 1000 - request will be sent but will be rejected by
                                the API
                            </div>}
                        </div>
                        <br/>
                        <button type="submit" value="Create Alert" className="btn btn-primary"
                                style={{backgroundColor: "#00a0e2"}}
                                disabled={this.state.buttonDisabled}>Submit
                        </button>
                    </form>
                    <br/>
                    <div className="container m-2">
                        <h2>Response:</h2>
                        {this.state.response !== '' && this.state.response}
                    </div>
                </Container>
            </div>
        );
    }
}