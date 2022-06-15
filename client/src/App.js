import React from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';


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
                    <Switch>
                        <Route path={`/`} component={LandingPage} exact />
                    </Switch>
                </div>
            </Router>
        </ThemeProvider>
    );
} 

export default App; 
