import React, {Component} from 'react';
import {Container, Spinner} from 'react-bootstrap';
import axios from 'axios';
import MaterialTable from "material-table";

export default class AlertConfigsTablePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true,
            response: null
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

    deleteAlertId(fa_alert_id) {
        let processedData = {'fa_alert_id': fa_alert_id};
        axios.post('/api/delete', JSON.stringify(processedData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            console.log("Sent JSON payload to backend successfully: " + response.data);
            this.setState({response: response.data["Description"]});
            // Refresh data in table
            this.fetchData();
        }).catch(error => {
            console.error("Error occurred in sending JSON payload to backend: " + error);
            this.setState({response: error.data["Description"]});
        });
    }

    render() {
        const {data, loading} = this.state;

        return (
            <div className="alert-config-page-wrapper">
                <div className="alert-config-page-title">Alert Configurations Table</div>
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
                                editable={{
                                    onRowDelete: oldData =>
                                        new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                                this.deleteAlertId(oldData['fa_alert_id']);
                                                resolve();
                                            }, 1000);
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
                                        start_date: (new Date(alert.start_date)).toLocaleDateString('en-US', {timeZone: 'UTC'}),
                                        end_date: (new Date(alert.end_date)).toLocaleDateString('en-US', {timeZone: 'UTC'}),
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