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
            if (this.state.response === '') {
                this.setState({response: error.data["Description"]});
            } else {
                let holder = this.state.response;
                holder += error.data["Description"] + '\n';
                this.setState({response: holder});
            }
        });
    }

    deleteAlerts = (selected_alerts) => {
        // Loop through selected alerts and delete
        this.setState({response: ''}, () => {
            for (const alert_config of selected_alerts) {
                this.deleteAlertId(alert_config["fa_alert_id"]);
            }
        });
    }

    editAlert(new_fa_alert_data) {
        let copy_new_fa_alert_data = {...new_fa_alert_data};
        copy_new_fa_alert_data['start_date'] = !copy_new_fa_alert_data['start_date'] ? null : convertToFormattedISO((new Date(copy_new_fa_alert_data['start_date'])).toISOString());
        copy_new_fa_alert_data['end_date'] = !copy_new_fa_alert_data['end_date'] ? null : convertToFormattedISO((new Date(copy_new_fa_alert_data['end_date'])).toISOString());
        // Change Events Data before sending
        copy_new_fa_alert_data['arrival'] = copy_new_fa_alert_data['arrival'] === 'True';
        copy_new_fa_alert_data['cancelled'] = copy_new_fa_alert_data['cancelled'] === 'True';
        copy_new_fa_alert_data['departure'] = copy_new_fa_alert_data['departure'] === 'True';
        copy_new_fa_alert_data['diverted'] = copy_new_fa_alert_data['diverted'] === 'True';
        copy_new_fa_alert_data['filed'] = copy_new_fa_alert_data['filed'] === 'True';
        delete copy_new_fa_alert_data['is_from_app'];
        axios.post('/api/modify', JSON.stringify(copy_new_fa_alert_data), {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.data["Success"]) {
                console.log("Sent JSON payload to backend successfully: " + response.data["Description"]);
                // Refresh data in table
                this.fetchData();
            } else {
                // Because only editing one alert at a time, just update response
                console.error("Error occurred updating alert: " + response.data["Description"]);
                // Don't refresh table - send error description
                this.setState({response: response.data["Description"]});
            }
        }).catch(error => {
            console.error("Error occurred in sending JSON payload to backend: " + error);
            this.setState({response: error.data["Description"]});
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
                            selection: true,
                            selectionProps: (rowData) => {
                                rowData.tableData.disabled = rowData['is_from_app'] === 'False';
                                return {
                                    disabled: rowData['is_from_app'] === 'False',
                                }
                            }
                        }}
                        actions={[
                            {
                                tooltip: 'Remove All Selected Alerts',
                                icon: 'delete',
                                onClick: (evt, data) => this.deleteAlerts(data)
                            }
                        ]}
                        editable={{
                            isEditable: rowData => rowData['is_from_app'] === 'True',
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        this.setState({response: ''}, () => {
                                            this.editAlert(newData);
                                        });

                                        resolve();
                                    }, 1000);
                                })

                        }}
                        columns={[{
                            title: "FA Alert ID", field: "fa_alert_id", editable: "never",
                        }, {
                            title: "Ident", field: "ident",
                        }, {
                            title: "Origin", field: "origin",
                        }, {
                            title: "Destination", field: "destination",
                        }, {
                            title: "Aircraft Type", field: "aircraft_type",
                        }, {
                            title: "Start Date (Y-M-D)", field: "start_date", validate: (rowData) => {
                                if (!rowData['start_date']) return true;
                                let holderDate = new Date(rowData['start_date']);
                                return holderDate instanceof Date && !isNaN(holderDate.getTime()) ? true : {isValid: false, helperText: 'Invalid Date - Must be ISO8601 parseable' };
                            }
                        }, {
                            title: "End Date (Y-M-D)", field: "end_date", validate: (rowData) => {
                                if (!rowData['end_date']) return true;
                                let holderDate = new Date(rowData['end_date']);
                                return holderDate instanceof Date && !isNaN(holderDate.getTime()) ? true : {isValid: false, helperText: 'Invalid Date - Must be ISO8601 parseable' };
                            }
                        }, {
                            title: "Max Weekly", field: "max_weekly",
                        }, {
                            title: "ETA", field: "eta",
                        }, {
                            title: "Arrival", field: "arrival", validate: (rowData) =>
                                rowData['arrival'] === 'True' || rowData['arrival'] === 'False' ? true : {isValid: false, helperText: 'Invalid Value - Must be True or False' }
                        }, {
                            title: "Cancelled", field: "cancelled", validate: (rowData) =>
                                rowData['cancelled'] === 'True' || rowData['cancelled'] === 'False' ? true : {isValid: false, helperText: 'Invalid Value - Must be True or False' }
                        }, {
                            title: "Departure", field: "departure", validate: (rowData) =>
                                rowData['departure'] === 'True' || rowData['departure'] === 'False' ? true : {isValid: false, helperText: 'Invalid Value - Must be True or False' }
                        }, {
                            title: "Diverted", field: "diverted", validate: (rowData) =>
                                rowData['diverted'] === 'True' || rowData['diverted'] === 'False' ? true : {isValid: false, helperText: 'Invalid Value - Must be True or False' }
                        }, {
                            title: "Filed", field: "filed", validate: (rowData) =>
                                rowData['filed'] === 'True' || rowData['filed'] === 'False' ? true : {isValid: false, helperText: 'Invalid Value - Must be True or False' }
                        }, {
                            title: "Alert Created Using Webapp?", field: "is_from_app", editable: "never", headerStyle: { backgroundColor: "#66829E" }
                        }]}
                        data={data.map(alert => ({
                            fa_alert_id: alert.fa_alert_id,
                            ident: alert.ident,
                            origin: alert.origin,
                            destination: alert.destination,
                            aircraft_type: alert.aircraft_type,
                            start_date: alert.start_date === null ? null : convertToFormattedISO((new Date(alert.start_date)).toISOString()),
                            end_date: alert.end_date === null ? null : convertToFormattedISO((new Date(alert.end_date)).toISOString()),
                            max_weekly: alert.max_weekly,
                            eta: alert.eta,
                            arrival: (alert.arrival ? 'True' : 'False'),
                            cancelled: (alert.cancelled ? 'True' : 'False'),
                            departure: (alert.departure ? 'True' : 'False'),
                            diverted: (alert.diverted ? 'True' : 'False'),
                            filed: (alert.filed ? 'True' : 'False'),
                            is_from_app: (alert.is_from_app ? 'True' : 'False')
                        }))}
                    /> : <div className="alert-config-table-spinner">
                        <Spinner animation="border" variant="primary"/>
                    </div>}
                </div>
            </div>
            <div className="container m-2">
                <h2>Response if deleting or updating alert(s):</h2>
                {this.state.response !== '' && this.state.response}
            </div>
        </div>)
    }
}

// Use this function to make the date "pretty" on the table by removing the time
function convertToFormattedISO(date) {
    return date.substring(0, date.indexOf('T'));
}
