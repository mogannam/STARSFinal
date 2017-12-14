/**
 * Created by KurtGranborg on 11/6/2017.
 */
import React, {Component} from 'react';
import {Nav, NavItem, PageHeader} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'

import '../header.css'
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
                <img className="floatLeft" width="10%" height="10%" src={require('../images/starsdatabase5.png')} alt="Image of STARS Emblem"/>
                <img  className="floatRight" width="15%" height="15%" src={require('../images/starsdatabase3.png')} alt="Image of STARS Emblem 2"/>
                <img className="floatRight" width="15%" height="15%" src={require('../images/starsdatabase.jpg')} alt="Image of STARS Emblem 2"/>
                
                <div ><PageHeader  >SSU STARS <small>Sustainability Tracking, Assesment, & Rating System</small></PageHeader> </div>

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
                  

                     <LinkContainer to ="/filter">
                        <NavItem eventKey={2}>
                            Queries
                        </NavItem>
                    </LinkContainer>

                     <LinkContainer to ="/reportingFieldsRoute">
                        <NavItem eventKey={3}>
                            Credits
                        </NavItem>
                    </LinkContainer>

                    



                </Nav>
                

            </div>
        )
    }
}

export default Header;