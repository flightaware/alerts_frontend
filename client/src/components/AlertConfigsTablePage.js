import React, {Component} from 'react';
import {Container, Spinner} from 'react-bootstrap';
import axios from 'axios';
import MaterialTable from "material-table";

export default class AlertConfigsTablePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [], loading: true, response: ''
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        axios.get('/api/alert_configs')
            .then(response => {
                this.setState({
                    data: response.data["alert_configurations"], loading: false
                });
            });
    }

    deleteAlertId(fa_alert_id) {
        let processedData = {'fa_alert_id': fa_alert_id};
        axios.post('/api/delete', JSON.stringify(processedData), {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.data["Success"]) {
                console.log("Sent JSON payload to backend successfully: " + response.data["Description"]);
                // Refresh data in table
                this.fetchData();
            } else {
                console.error("Error occurred deleting alert: " + response.data["Description"]);
                // Don't refresh table - send error description
                // Only change if response is not empty (multiple consecutive deletes)
                if (this.state.response === '') {
                    this.setState({response: response.data["Description"]});
                } else {
                    let holder = this.state.response;
                    holder += response.data["Description"] + '\n';
                    this.setState({response: holder});
                }
            }
        }).catch(error => {
            console.error("Error occurred in sending JSON payload to backend: " + error);
            return error.data["Description"];
        });
    }

    deleteAllAlerts = () => {
        // Loop through all alerts and delete
        this.setState({response: ''}, () => {
            for (const alert_config of this.state.data) {
                if (alert_config['is_from_app'] === true) {
                    this.deleteAlertId(alert_config["fa_alert_id"]);
                } else {
                    let holder = this.state.response;
                    holder += "FRONT-END ERROR: This is an alert that was not " +
                        "created in the app, you cannot delete it through here. Please delete " +
                        "it through a DELETE request.\n";
                    this.setState({response: holder});
                }
            }
        });
    }

    render() {
        const {data, loading} = this.state;

        return (<div className="alert-config-page-wrapper d-flex justify-content-center align-items-center flex-column">
            <div className="alert-config-page-title">Alert Configurations Table</div>
            <div className="table-wrapper">
                <div className="alert-config-page-table-inner">
                    {!loading ? <MaterialTable
                        title="Alert Configurations"
                        options={{
                            search: true, pageSize: 10, headerStyle: {
                                fontFamily: 'Helvetica', backgroundColor: '#002F5D', color: '#FFF',
                            }, cellStyle: {
                                fontFamily: 'Helvetica-Light', padding: '10px',
                            },
                        }}
                        editable={{
                            onRowDelete: oldData => new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    this.setState({response: ''}, () => {
                                        if (oldData['is_from_app'] === '✔') {
                                            this.deleteAlertId(oldData['fa_alert_id']);
                                        } else {
                                            this.setState({
                                                response: "FRONT-END ERROR: This is an alert that was not " +
                                                    "created in the app, you cannot delete it through here. Please delete " +
                                                    "it through a DELETE request."
                                            });
                                        }
                                    });

                                    resolve();
                                }, 1000);
                            })
                        }}
                        columns={[{
                            title: "FA Alert ID", field: "fa_alert_id",
                        }, {
                            title: "Ident", field: "ident",
                        }, {
                            title: "Origin", field: "origin",
                        }, {
                            title: "Destination", field: "destination",
                        }, {
                            title: "Aircraft Type", field: "aircraft_type",
                        },
                            /* Note: start/end date use the same variable format
                                     as SQL date column name for consistency */
                            {
                                title: "Start Date (M/D/Y)", field: "start_date",
                            }, {
                                title: "End Date (M/D/Y)", field: "end_date",
                            }, {
                                title: "Max Weekly", field: "max_weekly",
                            }, {
                                title: "ETA", field: "eta",
                            }, {
                                title: "Arrival", field: "arrival",
                            }, {
                                title: "Cancelled", field: "cancelled",
                            }, {
                                title: "Departure", field: "departure",
                            }, {
                                title: "Diverted", field: "diverted",
                            }, {
                                title: "Filed", field: "filed",
                            }, {
                                title: "Alert Created Using Webapp?", field: "is_from_app",
                            }]}
                        data={data.map(alert => ({
                            fa_alert_id: alert.fa_alert_id,
                            ident: alert.ident,
                            origin: alert.origin,
                            destination: alert.destination,
                            aircraft_type: alert.aircraft_type,
                            start_date: alert.start_date === null ? null : (new Date(alert.start_date)).toLocaleDateString('en-US', {timeZone: 'UTC'}),
                            end_date: alert.end_date === null ? null : (new Date(alert.end_date)).toLocaleDateString('en-US', {timeZone: 'UTC'}),
                            max_weekly: alert.max_weekly,
                            eta: alert.eta,
                            arrival: (alert.arrival ? '✔' : '✖'),
                            cancelled: (alert.cancelled ? '✔' : '✖'),
                            departure: (alert.departure ? '✔' : '✖'),
                            diverted: (alert.diverted ? '✔' : '✖'),
                            filed: (alert.filed ? '✔' : '✖'),
                            is_from_app: (alert.is_from_app ? '✔' : '✖')
                        }))}
                    /> : <div className="alert-config-table-spinner">
                        <Spinner animation="border" variant="primary"/>
                    </div>}
                </div>
            </div>
            <div className="alert-config-delete-all-alerts-wrapper">
                <button onClick={this.deleteAllAlerts} value="Delete All Alerts" className="btn submit-button">
                    Delete All Alerts
                </button>
            </div>
            <div className="container m-2">
                <h2>Response if deleting alerts:</h2>
                {this.state.response !== '' && this.state.response}
            </div>
        </div>)
    }
}
