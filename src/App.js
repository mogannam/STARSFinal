import React from 'react';
import {Route, Router, Switch} from "react-router-dom";
import Home from './Modules/home';
import Header from './Modules/header';
import FirstRoute from './Modules/firstRoute'
import SecondRoute from './Modules/secondRoute'

import JoeTestRoute from './Modules/joeTestRoute'
import QuestionRoute from './Modules/questionRoute'
import filterRoute from './Modules/filterRoute'
import reportingFieldsRoute from './Modules/reportingFieldsRoute'

import createHistory from "history/createBrowserHistory";
import './App.css';

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
                        <Route path="/route1" component={FirstRoute}/>
                        <Route path="/route2" component={SecondRoute}/>
                        <Route path="/joe" component={JoeTestRoute}/>
                        <Route path="/question" component={QuestionRoute}/>
                        <Route path="/filter" component={filterRoute}/>
                        <Route path="/reportingFieldsRoute" component={reportingFieldsRoute}/>
                    </Switch>
                </div>
            </Router>
    );
  }
}

export default App;
