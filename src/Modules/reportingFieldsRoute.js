

// https://www.npmjs.com/package/axios // good axios article

import React, {Component} from 'react';
import axios from 'axios'
import {Table} from 'react-bootstrap'
import {Collapse} from 'react-collapse';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import Parser from 'html-react-parser';

import '../reportingFieldsRoute.css'


//Table headers in array
const headers = [
   "Stars Credit Refrence",
   "Credit ID",
   "Year",
   "Version",
   "Title",
   "Points Recieved",
   "Possible Points",
   "Description",
   "Responsible Party",
   "Responsible Party\'s Title",
   "Responsible Department",
   
  

];

//Object names in array, used to index data returned from mysql queries
const objectKeys = [
   "area_abbr",
   "cr_ID",
   "year",
   "version",
   "cr_title",
   "yes_points",
   "pos_points",
   "cr_descr",
   "resp_party",
   "resp_title",
   "resp_dept",
   
];





class filterRoute extends Component {
	constructor(props){
        super(props);
        this.state = {
            data: [], // will hold the data displayed to the user returned from mysql query
            titleQuestions: [], 
            isCollapsed: {},
            
        }

        // an event listener that handles submitting data to filter by
        //this.handleSubmit = this.handleSubmit.bind(this);
        
        //this.collapseDescription = this.collapseDescription.bind(this);
        
        

    }

       //Loads the data before the component mounts
    
    
    componentWillMount(){ // componentWillMount
        //Server is hosted at localhost:8080, I suggest holding this in single variable
        //that will be used by all calls, and appending the desires suffix.

        // queries mysql data before the page renders to be displayed


    // get a Dictionary of arrays, each nested array contains mysql dictionary elements
    axios.get('http://localhost:8080/title_questions').then((res, err) =>
    {// get categories to fill the filter menu with categories
        if (err)
            this.setState({error: err});
        else
            {

            //console.log(returnData);
            //console.log("in reportingFieldsRoute component did mount")
            //console.log("data is : ", returnData);
            this.setState({titleQuestions: res.data}, );

            
            }
    })


    axios.get('http://localhost:8080/reporting_fields2').then((res, err) =>
    { // get all table data before page loads (without filtering)
        if (err)
            this.setState({error: err});
        else
            {
            
            var isCollapsed = {};
            
            var tempDict = res.data; // get a dictionary of arrays, each array contains mysql json Dict
            for(var key in tempDict){ // loop over the keys in the dict
               var tempArray = tempDict[key];
               for(var index in tempArray){ // for each array nested in the dictionary
                    var aJson = tempArray[index];
                    var tempId = aJson["cr_ID"];
                    //console.log("q_id : ",tempId);
                    isCollapsed[tempId] = false;
               }
            }

            //console.log(JSON.stringify(isCollapsed));

            this.setState({data: res.data, isCollapsed: isCollapsed});
            //console.log(res.data)
            
            }
    })

    
   



      
   
           
    };



collapseDescription(cr_ID, event){
        // collapse category filter, section
        // an event handler that allows the user to open/close the categories filter tab
      
        event.preventDefault(); // called to prevent the default rendering of the page
                // needed b/c otherwise it will query the DB for all the data
                // and prevent the user from filtering.
        
        const {isCollapsed} = this.state;
        //const target = event.target;
        isCollapsed[cr_ID] = !isCollapsed[cr_ID];

        this.setState({isCollapsed: isCollapsed}); 
    } 


 


   render(){
        //Get variables from state
        const {data, error, FirstYear,secondYear, categories, titleQuestions} = this.state;



        //If data is [], returns loading
        if(!data || !titleQuestions)
            return <h1>Loading</h1>;
        // If theres an error give a message.
        if(error)
            return <h1>An error occured</h1>
        return (


            <div>

                <div className="questions">
                    
                   {
                     Object.keys(data).map( 
                        (key, index) => (  // loop over dictionary of arrays

                            <div key={index}>
                            <Table >
                            <thead>
                            <tr>
                                <th > { data[index+1][0]["area_title"] } </th>
                            </tr>
                            <tr>
                                {headers.map((head, index) => <th className="tableHeaderReport" key={index}>{head}</th>)}
                            </tr>
                            </thead>
                            <tbody>

                            
                             {

                                data[index+1].map( // loop over each array 
                                    (arrElement, index2) => (
                                        
                                      <tr key={index2}>{
                                            objectKeys.map( // loop over json dictionary indicies in order i specify
                                                (jsonKey, index3) => (

                                                <td  key={index3} >
                                                {jsonKey === "cr_descr" ? 
                                                    <div>
                                                    <button className="btn btn-primary" color="primary" onClick={this.collapseDescription.bind(this,arrElement["cr_ID"])} >Click for more info &#9660; </button>
                                                    <Collapse isOpened={this.state.isCollapsed[arrElement["cr_ID"]]}>
                                                      {arrElement[jsonKey]}
                                                    </Collapse>
                                                    </div> : arrElement[jsonKey] }
                                                </td>

                                                )
                                            )

                                        }</tr>
                                    )
                                )
                              

                            }
                            </tbody>
                            </Table> <br/><br/><hr/> <br/><br/> </div>
                            
                            
                        )
                    )}
                    


                </div>
            </div>
        )
    }







   




}
export default filterRoute;
