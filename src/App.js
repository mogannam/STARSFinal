import React from 'react';
import {Route, Router, Switch} from "react-router-dom";
import Home from './Modules/home';
import Header from './Modules/header';
import FirstRoute from './Modules/firstRoute'
import SecondRoute from './Modules/secondRoute'
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
                    </Switch>
                </div>
            </Router>
    );
  }
}

export default App;
