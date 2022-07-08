import React, {Component} from 'react';
import {Container, Spinner} from 'react-bootstrap';
import axios from 'axios';
import MaterialTable from "material-table";

export default class AlertConfigsTable extends Component {
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
        const { data, loading } = this.state;

        return (<div>
            <div className="table-wrapper">
                <div className="airport-page-table-inner">
                    {!loading ?
                        <MaterialTable
                            title="Alerts"
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
                                rowStyle: rowData => ({
                                    backgroundColor: rowData.cancelled ? '#FF000055' : '#00000000'
                                })
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
                                    title: "Start Date",
                                    field: "start_date",
                                },
                                {
                                    title: "End Date",
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
                                    start_date: alert.start_date,
                                    end_date: alert.end_date,
                                    max_weekly: alert.max_weekly,
                                    eta: alert.eta,
                                    arrival: alert.arrival,
                                    cancelled: alert.cancelled,
                                    departure: alert.departure,
                                    diverted: alert.diverted,
                                    filed: alert.filed
                                }
                            ))}
                        />
                        :
                        /* TODO: add this class*/
                        <div className="alerts-table-spinner">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    }
                </div>
            </div>
        </div>)
    }
}