import React, {Component} from 'react';
import {Container, Spinner} from 'react-bootstrap';
import axios from 'axios';
import MaterialTable from "material-table";

export default class AlertConfigsTablePage extends Component {
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
        axios.get('/api/alert_configs')
            .then(response => {
                this.setState({
                    data: response.data["alert_configurations"],
                    loading: false
                });
            });
    }

    render() {
        const {data, loading} = this.state;

        return (
            <div className="alert-config-page-wrapper">
                <div className="alert-config-page-title">Alert Configurations</div>
                <div className="table-wrapper">
                    <div className="alert-config-page-table-inner">
                        {!loading ?
                            <MaterialTable
                                title="Alert Configurations"
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
                                        title: "FA Alert ID",
                                        field: "fa_alert_id",
                                    },
                                    {
                                        title: "Ident",
                                        field: "ident",
                                    },
                                    {
                                        title: "Origin",
                                        field: "origin",
                                    },
                                    {
                                        title: "Destination",
                                        field: "destination",
                                    },
                                    {
                                        title: "Aircraft Type",
                                        field: "aircraft_type",
                                    },
                                    /* Note: start/end date use the same variable format
                                     as SQL date column name for consistency */
                                    {
                                        title: "Start Date (M/D/Y)",
                                        field: "start_date",
                                    },
                                    {
                                        title: "End Date (M/D/Y)",
                                        field: "end_date",
                                    },
                                    {
                                        title: "Max Weekly",
                                        field: "max_weekly",
                                    },
                                    {
                                        title: "ETA",
                                        field: "eta",
                                    },
                                    {
                                        title: "Arrival",
                                        field: "arrival",
                                    },
                                    {
                                        title: "Cancelled",
                                        field: "cancelled",
                                    },
                                    {
                                        title: "Departure",
                                        field: "departure",
                                    },
                                    {
                                        title: "Diverted",
                                        field: "diverted",
                                    },
                                    {
                                        title: "Filed",
                                        field: "filed",
                                    }
                                ]}
                                data={data.map(alert => (
                                    {
                                        fa_alert_id: alert.fa_alert_id,
                                        ident: alert.ident,
                                        origin: alert.origin,
                                        destination: alert.destination,
                                        aircraft_type: alert.aircraft_type,
                                        start_date: (new Date(alert.start_date)).toLocaleDateString(),
                                        end_date: (new Date(alert.end_date)).toLocaleDateString(),
                                        max_weekly: alert.max_weekly,
                                        eta: alert.eta,
                                        arrival: (alert.arrival ? '✔' : '✖'),
                                        cancelled: (alert.cancelled ? '✔' : '✖'),
                                        departure: (alert.departure ? '✔' : '✖'),
                                        diverted: (alert.diverted ? '✔' : '✖'),
                                        filed: (alert.filed ? '✔' : '✖')
                                    }
                                ))}
                            />
                            :
                            <div className="alert-config-table-spinner">
                                <Spinner animation="border" variant="primary"/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}