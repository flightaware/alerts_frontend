import React from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AlertConfigsTablePage from "./components/AlertConfigsTablePage";


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
                    <AppNavbar/>
                    <Switch>
                        <Route path={`/`} component={LandingPage} exact />
                        <Route path={`/alert_configs`} component={AlertConfigsTablePage} exact />
                    </Switch>
                </div>
            </Router>
        </ThemeProvider>
    );
} 

export default App; 
