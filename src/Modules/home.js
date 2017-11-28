/**
 * Created by KurtGranborg on 11/6/2017.
 */
import React, {Component} from 'react';
import axios from 'axios'
import {Table} from 'react-bootstrap'

//Table headers in array
const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Major",
];

//Object names in array
const objectKeys = [
    "ID",
    "student_fName",
    "student_lName",
    "career",
];

//Loads data from server and presents it in a table
class Home extends Component{
    constructor(props){
        super(props);
        this.state = {data: []}
    }
    //Loads the data before the component mounts
    componentWillMount(){
        //Server is hosted at localhost:8080, I suggest holding this in single variable
        //that will be used by all calls, and appending the desires suffix.
        axios.get('http://localhost:8080/students').then((res, err) =>
        {
            if (err)
                this.setState({error: err});
            else
                this.setState({data: res.data});
        })
    };

    render(){
        //Get variables from state
        const {data, error} = this.state;
        //If data is [], returns loading
        if(!data)
            return <h1>Loading</h1>;
        //If there's an error give a message.
        if(error)
            return <h1>An error occured</h1>
        return (
            <div>
                <Table>
                    <thead>
                    <tr>
                        {headers.map((head, index) => <th key = {index}>{head}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {/* Map over all data indices, then objectKeys to display table */
                    data.map((datum, index) => (
                        <tr key={index}>
                            {objectKeys.map((obj, index2) => (
                                <td key={index2}>
                                    {datum[obj]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        )
    }
}
export default Home;