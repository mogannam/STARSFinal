import React from 'react';
import {Route, Router, Switch} from "react-router-dom";
import Home from './Modules/home';
import Header from './Modules/header';


import filterRoute from './Modules/filterRoute'
import reportingFieldsRoute from './Modules/reportingFieldsRoute'

import createHistory from "history/createBrowserHistory";
import './css/App.css';

export const history = createHistory();

class App extends React.Component {
  render() {
    return (
            <Router history={history}>
                <div>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"/>
                    <header>
                        <Header/>
                    </header>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/filter" component={filterRoute}/>
                        <Route path="/reportingFieldsRoute" component={reportingFieldsRoute}/>
                    </Switch>
                </div>
            </Router>
    );
  }
}

export default App;
