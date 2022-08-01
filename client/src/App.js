import React from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AlertConfigsTablePage from "./components/AlertConfigsTablePage";
import PostedAlertsTablePage from "./components/PostedAlertsTablePage";


const App = () => {
    const tableTheme = createMuiTheme({
        overrides: {
            MuiTableSortLabel: {
                root: {
                    color: '#fff',
                    '&:hover': {
                        color: 'whitesmoke'
                    },
                    '&:focus': {
                        color: 'whitesmoke'
                    }
                },
                active: {
                    color: 'whitesmoke !important'
                },
                icon: {
                    color: 'whitesmoke !important'
                }
            }
        }
    });
    return (
        <ThemeProvider theme={tableTheme}>
            <Router>
                <div className="app">
                    <div className="example-notification-bar justify-content-center d-flex">
                        PLEASE NOTE: This webapp is purely a demonstration of AeroAPI alerting features
                        and best practices. It is not meant to be used in production.
                    </div>
                    <AppNavbar/>
                    <Switch>
                        <Route path={`/`} component={LandingPage} exact />
                        <Route path={`/alert_configs`} component={AlertConfigsTablePage} exact />
                        <Route path={`/posted_alerts`} component={PostedAlertsTablePage} exact />
                    </Switch>
                </div>
            </Router>
        </ThemeProvider>
    );
} 

export default App; 
