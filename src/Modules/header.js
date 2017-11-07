/**
 * Created by KurtGranborg on 11/6/2017.
 */
import React, {Component} from 'react';
import {Nav, NavItem, PageHeader} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
class Header extends Component {
    constructor(props){
        super(props);
        this.state = {active: 1}
    }


    handleSelect =(index) => {
        this.setState({active: index});
    };
    //Creates our header tabs for the app
    render(){
        return (
            <div>
                {/*Page header used by bootstrap to name the app */}
                <PageHeader>Title <small>Words to live by</small></PageHeader>
                {/*
                    Nav/NavItem used by bootstrap to create links to different routes.
                    React-router v4 uses "Link" imported from 'react-router-dom' rather
                    than simple hrefs. Since bootstrap NavItems use hrefs, we need to
                    use LinkContainer to make them play nice.
                 */}
                <Nav bsStyle="tabs">
                    <LinkContainer exact={true} to ="/">
                        <NavItem eventKey={1}>
                            Home
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to ="/route1">
                        <NavItem eventKey={2}>
                            Route 1
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to ="/route2">
                        <NavItem eventKey={3}>
                            Route 2
                        </NavItem>
                    </LinkContainer>
                </Nav>
            </div>
        )
    }
}

export default Header;