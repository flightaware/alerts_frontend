import React, {Component} from 'react';
import {Container, Spinner} from 'react-bootstrap';
import axios from 'axios';
import MaterialTable from "material-table";

export default class PostedAlertsTablePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        axios.get('/api/posted_alerts')
            .then(response => {
                this.setState({
                    data: response.data["posted_alerts"],
                    loading: false
                });
            });
    }

    render() {
        const {data, loading} = this.state;

        return (
            <div className="posted-alerts-page-wrapper">
                <div className="posted-alerts-page-title">Posted Alerts Table</div>
                <div className="table-wrapper">
                    <div className="posted-alerts-page-table-inner">
                        {!loading ?
                            <MaterialTable
                                title="Posted Alerts"
                                options={{
                                    search: true,
                                    pageSize: 10,
                                    headerStyle: {
                                        fontFamily: 'Helvetica',
                                        backgroundColor: '#002F5D',
                                        color: '#FFF',
                                    },
                                    cellStyle: {
                                        fontFamily: 'Helvetica-Light',
                                        padding: '10px',
                                    },
                                }}
                                columns={[
                                    {
                                        title: "ID of the Posted Alert",
                                        field: "id",
                                    },
                                    {
                                        title: "Time Alert Was Received (UTC)",
                                        field: "time_alert_received",
                                    },
                                    {
                                        title: "Long Description",
                                        field: "long_description",
                                    },
                                    {
                                        title: "Short Description",
                                        field: "short_description",
                                    },
                                    {
                                        title: "Summary",
                                        field: "summary",
                                    },
                                    {
                                        title: "Event Code",
                                        field: "event_code",
                                    },
                                    {
                                        title: "Alert ID",
                                        field: "alert_id",
                                    },
                                    {
                                        title: "FlightAware Flight ID",
                                        field: "fa_flight_id",
                                    },
                                    {
                                        title: "Ident",
                                        field: "ident",
                                    },
                                    {
                                        title: "Registration",
                                        field: "registration",
                                    },
                                    {
                                        title: "Aircraft Type",
                                        field: "aircraft_type",
                                    },
                                    {
                                        title: "Origin",
                                        field: "origin",
                                    },
                                    {
                                        title: "Destination",
                                        field: "destination",
                                    },
                                ]}
                                data={data.map(alert => (
                                    {
                                        id: alert.id,
                                        time_alert_received: alert.time_alert_received,
                                        long_description: alert.long_description,
                                        short_description: alert.short_description,
                                        summary: alert.summary,
                                        event_code: alert.event_code,
                                        alert_id: alert.alert_id,
                                        fa_flight_id: alert.fa_flight_id,
                                        ident: alert.ident,
                                        registration: alert.registration,
                                        aircraft_type: alert.aircraft_type,
                                        origin: alert.origin,
                                        destination: alert.destination,
                                    }
                                ))}
                            />
                            :
                            <div className="posted-alerts-table-spinner">
                                <Spinner animation="border" variant="primary"/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}