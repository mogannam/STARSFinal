

// https://www.npmjs.com/package/axios // good axios article

import React, {Component} from 'react';
import axios from 'axios'
import {Table} from 'react-bootstrap'
import {Collapse} from 'react-collapse';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import Parser from 'html-react-parser';

import '../css/reportingFieldsRoute.css'


//Table headers in array
// this array represents the table headers displayed to the user on the web page
const headers = [
   "Stars Credit Refrence",
   "Credit Number",
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
   "cr_num",
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

    }

       
  //Loads the data before the component mounts 
    componentWillMount(){ // componentWillMount
        
    // get a Dictionary of arrays, each nested array contains json dictionary elements
    axios.get('http://localhost:8080/title_questions').then((res, err) =>
    {// get categories to fill the filter menu with categories
        if (err)
            this.setState({error: err});
        else
            {
            this.setState({titleQuestions: res.data}, );
            }
    })


    axios.get('http://localhost:8080/reporting_fields2').then((res, err) =>
    { // get all table data before page loads 
        if (err)
            this.setState({error: err});
        else
            {
              // the result retuned from api is formatted as so :
              // we are trying to group together data based on its areasd ID. an example of the structure:
            /*
                {
                    "0" : [  {"area_ID" : 0, "area_abbr" : AC, ........ More unique json data ....}, 
                             {"area_ID" : 0, "area_abbr" : AC, ........ More unique json data ....} 
                          ],

                    "1" : [ {"area_ID" : 1, "area_abbr" : AC, ........ More unique json data ....},
                            {"area_ID" : 1, "area_abbr" : AC, ........ More unique json data ....}
                           ],

                     "2" : [ {"area_ID" : 2, "area_abbr" : AC, ........ More unique json data ....},
                            {"area_ID" : 2, "area_abbr" : AC, ........ More unique json data ....}
                           ]
                }
            */
            var isCollapsed = {};// a dictionary of booleans. The booleans will be used to determine
                  // if thw description element should have an open/ closed dropdown.
            

            // this for loop is just initializing a boolean dictionary to figure out howmany description drop downs will exist.
            var tempDict = res.data; // get a dictionary of arrays, each array contains mysql json 
            for(var key in tempDict){ // loop over the keys in the dict
               var tempArray = tempDict[key]; // get the array of json dictionarys
               for(var index in tempArray){ // for each array nested in the dictionary
                    var aJson = tempArray[index]; // get one json value
                    var tempId = aJson["cr_ID"]; // get the cr_ID from the json 
                    //console.log("q_id : ",tempId);
                    isCollapsed[tempId] = false; // initialize the boolean dictionary
               }
            }

            //console.log(JSON.stringify(isCollapsed));

            this.setState({data: res.data, isCollapsed: isCollapsed});
            //console.log(res.data)
            
            }
    })

    
   



      
   
           
    };



collapseDescription(cr_ID, event){
        // collapse description drop down
        // an event handler that allows the user to open/close the description  drop down
      
        event.preventDefault(); // called to prevent the default rendering of the page
                // needed b/c otherwise it will query the DB for all the data
                // and prevent the user from filtering.
        
        const {isCollapsed} = this.state; // get dictionary of all boolean values controlling the dropdown contion
        //const target = event.target;
        isCollapsed[cr_ID] = !isCollapsed[cr_ID]; // update the boolean dictionary, because the user toggled it
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

                <div className="bodyClass">
                    
                   { /* loop over the keys to the dictionary. 
                    The keys represent the area_ID. Remeber we are trying to group togehter data with the same area_ID.*/
                     Object.keys(data).map( 
                        (key, index) => (  // loop over dictionary keys, generate the table headers for each area

                            <div key={index}>
                            <Table >
                            <thead>
                            <tr>
                               
                              
                                <th > {  data[index+1][0]["area_title"] } </th>
                            </tr>
                            <tr>
                                
                                {headers.map((head, index) => <th className="tableHeaderReport" key={index}>{head}</th>)}
                            </tr>
                            </thead>
                            <tbody>

                            
                             {
                               
                                
                                data[index+1].map( // loop over each dictionary, get an array of json elements
                                    (arrElement, index2) => (
                                        
                                      <tr key={index2}>{ // loop over objectKeys, for each array access json data with the keys in objectKeys
                                            objectKeys.map( // for each key insert its value into a new tr
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
