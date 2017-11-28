

// https://www.npmjs.com/package/axios // good axios article

import React, {Component} from 'react';
import axios from 'axios'
import {Table} from 'react-bootstrap'
import {Collapse} from 'react-collapse';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';

//import ReactDOM from 'react-dom'



import '../filterRoute.css'

//Table headers in array
const headers = [
    "question" , 
    "answer", 
    "year", 
    "credit_id", 
    "title",
    "q_id",
    "Category"

];

//Object names in array, used to index data returned from mysql queries
const objectKeys = [
  "question" , 
  "answer", 
  "years", 
  "credit_id", 
  "title_id",
  "q_id",
  "category"
];





class filterRoute extends Component {
	constructor(props){
        super(props);
        this.state = {
            data: [], // will hold the data displayed to the user returned from mysql query
            categories: [], // holds the categories to filter by, obtained from mysql query
            FirstYear : "",// I think no longer used, check before deletion
            secondYear: "", // I think no longer used
            fltrCatCollapseBool: false // used to control wheter to open/close filter by category drop down tab
        }

        // below for handling form work
        //this.handleChange = this.handleChange.bind(this);

        // an event listener that handles submitting data to filter by
        this.handleSubmit = this.handleSubmit.bind(this);

        
        

    }

       //Loads the data before the component mounts
    
    
    componentWillMount(){ // componentWillMount
        //Server is hosted at localhost:8080, I suggest holding this in single variable
        //that will be used by all calls, and appending the desires suffix.

        // queries mysql data before the page renders to be displayed


    
    axios.get('http://localhost:8080/reporting_fields').then((res, err) =>
    { // get all table data before page loads (without filtering)
        if (err)
            this.setState({error: err});
        else
            {
            //console.log("initial db call string " + JSON.stringify(res.data));
            //console.log(JSON.stringify(res.data, null, 4))
            this.setState({data: res.data});
            //console.log(res.data)
            
            }
    })

    axios.get('http://localhost:8080/get_categories').then((res, err) =>
    {// get categories to fill the filter menu with categories
        if (err)
            this.setState({error: err});
        else
            {
            //console.log("initial db call string " + JSON.stringify(res.data));
            //console.log(JSON.stringify(res.data, null, 4))
            //console.log(res.data);
                
            var tempData = res.data;
            var returnData = []
            for(var i in tempData){
                returnData.push(tempData[i]["category"])
            }

            //console.log(returnData);
            this.setState({categories: returnData}, );

            
            }
    })



      
   
           
    };
    

   

    // ++++ needed for submitting form +++++++
    /*handleChange(event) {
        event.preventDefault();
        const target = event.target;
        var FirstYearTemp = target.value1;
        var secondYearTemp = target.value2;

        this.setState({FirstYear: FirstYearTemp, secondYear: secondYearTemp});
        const tempState = this.state
        FirstYearTemp = tempState.FirstYear;
        secondYearTemp = tempState.secondYear;
        //var textOut = "first " + FirstYearTemp + " ||second : " + secondYearTemp; 
        //console.log(textOut);

        
        
        //this.setState({value: event.target.value});

    }*/

    collapseCatFltr(event){
        // an event handler that allows the user to open/close the categories filter tab
        event.preventDefault(); // called to prevent the default rendering of the page
                // needed b/c otherwise it will query the DB for all the data
                // and prevent the user from filtering.


        this.setState({fltrCatCollapseBool: !this.state.fltrCatCollapseBool});
    }

    /*handleFilterCategory(event){
        const target = event.target;
        console.log(target)  
    }*/



    //handleSubmit(event) {
    handleSubmit(event) { 
        // event handler that bundles up all the filtering data 
        // before  quering the database
        const { data, error, FirstYear, secondYear, categories} = this.state;

        event.preventDefault(); // prevent default rendering of the web page and
                // allows the user to filter  

        const target = event.target;

        // years the user wishes to filter by
        var FirstYearTemp = target.first.value;
        var secondYearTemp = target.second.value;

        // an array to hold all categories the users wnats to use in filtering
        var selectedCategories = []
        for(var i in categories){
            //console.log( categories[i] + " : "+ target[categories[i]].checked)
            // for each checked box get the boolean  to determine if its checked
            var currentBoxBool = target[categories[i]].checked;
            if(currentBoxBool)
                selectedCategories.push(categories[i]);

        }
     
        

        // query the DB with data the user wishes to filter by
        axios.get('http://localhost:8080/filter_reporting_fields', 
                {params: {
                    years: [FirstYearTemp,secondYearTemp,],
                    selectedCategories : selectedCategories
                }}


            ).then((res, err) =>
            {
               
                
                if (err)
                {
                    this.setState({error: err});
                }
                else
                    {// get data from DB & update page thru state change
                    this.setState({data: res.data, FirstYear: FirstYearTemp, secondYear: secondYearTemp});
                    var textOut = "data \n " + JSON.stringify(res.data); 
                    //console.log(textOut);
                   
                   
                    
                    }
                
            })
    };
  


  // ++++++++++ end of from functions +++++++


 


   render(){
        //Get variables from state
        const {data, error, FirstYear,secondYear, categories} = this.state;


        //If data is [], returns loading
        if(!data)
            return <h1>Loading</h1>;
        // If theres an error give a message.
        if(error)
            return <h1>An error occured</h1>
        return (


            <div>
                <div className="left"> 
                   
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <label>
                            Years Range: <br/>
                            <input 
                                id="first"
                                name="first"
                                type="number" 
                                
                                value1={this.state.FirstYear}
                              />
                            to 
                            <input 
                                id="second"
                                name="second"
                                type="number" 
                                
                                value2={this.state.secondYear}
                                 />
                        </label>
                        <br/>


                        <label>
                        <button className="btn btn-primary" color="primary" onClick={this.collapseCatFltr.bind(this)} >Filter by category &#9660; </button>
                        <Collapse isOpened={this.state.fltrCatCollapseBool}>
                          
                          
                           {categories.map(
                                    (oneCategory, index) => 
                                        <label key={index}> 
                                            {oneCategory} : 
                                            <input  type="checkbox" name={oneCategory} key={index} value={oneCategory} />
                                             &nbsp; &nbsp;   &nbsp; &nbsp;
                                        </label>
                                    )
                          }

                        </Collapse>
                        </label>

                        <br/>



                        <input className="btn btn-success" type="submit" value="Submit" />
                    </form>

                   


                </div> 

                <div className="right">
                    
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
                            <td key={index2}>{datum[obj]} </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                    </Table>


                </div>
            </div>
        )
    }








}
export default filterRoute;
