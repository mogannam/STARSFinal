

// https://www.npmjs.com/package/axios // good axios article

import React, {Component} from 'react';
import axios from 'axios'
import {Table} from 'react-bootstrap'
import {Collapse} from 'react-collapse';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';

//import ReactDOM from 'react-dom'



import '../css/filterRoute.css'


// ana array of all headers the user can toggle on and off in the table displayed
// this seperate array is similar to objectKeys, but it needs it own copy because
// by adding/removing elements from this array allows the designer to force what is 
// always displayed to the user. For example removing question, makes it so
// the user can never toggle that category on/off in the displayed table.
// in effect forcing it to always appear on the page.
const headerFilterOptions = [
    "cr_ID", 
    "area_ID",
    "question_ID",
    "year",
    "question" , 
    "answer", 
]
// a dictionary that maps the keys of header objectKeys, to the name displayed in the
// table displayed to the user. 
const headersOptions = {
    "question" : "Question" , 
    "answer": "Answer",
    "year" : "Year", 
    "cr_ID" : "Credit ID", 
    "title_ID" : "Title ID",
    "area_ID" : "Area ID",
    "question_ID" : "Question ID"

};




//Object Key names that are a set of all keys possible used to index the 
// returned json from the mysql query
const objectKeys = [
  "cr_ID",
  "area_ID",
  "question_ID",
  "year", 
  "question" , 
  "answer", 

];


// used to determine what header fields should be displayed in the table to the user
// at first all fileds should be set to true, to show all fields
// as the user toggels fields on/off they will switch from true to false
// TrueDictionary is a dictionary of keys with the value of true 
// ex: //headerSelected: {"question" : true, "answer" : true, "years": true, "credit_id" : true, "title_id" : true, "q_id" : true , "category" : true}
var tempDict = {}
var TrueDictionary = () => {for(var index in objectKeys) tempDict[objectKeys[index]] = true; return tempDict  }



class filterRoute extends Component {
	constructor(props){
        super(props);
        this.state = {
            data: [], // will hold the data displayed to the user returned from mysql query
            creditIDS: [], // holds the creditIds (in the drop down) to filter by, obtained from mysql query
            
            fltrCatCollapseBool: false, // used to control if we  open/close filter by credit id drop down tab
           
            //headers : ["question" ,  "answer",  "years",  "credit_id",  "title_id", "q_id", "category"], // old method
            // initialize the headers array for the first time
            headers : objectKeys.map( (key,index) =>  headersOptions[key] ), // used to change which headers are shown to the user
                    // if the user toggles headers on/off -> than elemens will be pushed or removed from the array
                    // of displayed headers.
            headerSelected : TrueDictionary() // assign a boolean dictionary, to indicate all headers should be shown
        }


        // an event listener that handles submitting data to filter 
        this.handleSubmit = this.handleSubmit.bind(this);

        
        

    }

       //Loads the data before the component mounts
    
    
    componentWillMount(){ // componentWillMount
        //Server is hosted at localhost:8080,
        // queries mysql data before the page renders to be displayed
        
        //console.log("headerSelected", this.state.headerSelected )

    
    axios.get('http://localhost:8080/reporting_fields').then((res, err) =>
    { // get all table data before page loads (without filtering)
        if (err)
            this.setState({error: err});
        else
            {
            //console.log("initial db call string " + JSON.stringify(res.data));
            //console.log(JSON.stringify(res.data, null, 4))
            this.setState({data: res.data});
            console.log(res.data)
            
            }
    })

    axios.get('http://localhost:8080/get_categories').then((res, err) =>
    {// get credit ids to fill the filter menu with credit ids in the drop down
        if (err)
            this.setState({error: err});
        else
            {
                
            var tempData = res.data;
            var returnData = []

            // loop over array of json dictionarys
            // from each json grab the credit IDs
            for(var i in tempData){
                returnData.push(tempData[i]["cr_ID"])
            }

            //console.log(returnData);

            //console.log("returnData ",returnData);
            this.setState({creditIDS: returnData}, );

            
            }
    })



      
   
           
    };
    



    collapseCreditFltr(event){
        // an event handler that allows the user to open/close the credit id filter tab
        event.preventDefault(); // called to prevent the default rendering of the page
                // needed b/c otherwise it will query the DB for all the data
                // and prevent the user from filtering.


        this.setState({fltrCatCollapseBool: !this.state.fltrCatCollapseBool});
    }

    alterHeaders(selected, event){

        // alters the headerSelected dictionary to toggle headers on/off
        event.preventDefault(); 
        
        var headSelected = selected["head"]; // get the selected header from the user input
           
        var target = event.target

        // get the current state of the headers array & headerSelected dictionary
        var {headers, headerSelected } = this.state;
        

        // update the headerSelected dictionary b/c user toggled a header on/off
        headerSelected[headSelected] = !headerSelected[headSelected]
        
        this.setState({headerSelected : headerSelected , headers : headers});
    
    }


    pushToArray(boolValue, whatToPush, arr){
        // a helper function that uses conditional testing on deciding if a value
        // should be pushed to the array "arr"
        if(boolValue) //if true push, else do nothing
            arr.push(whatToPush);
        return arr;
    }



    handleSubmit(event) { 
        // event handler that bundles up all the filtering data 
        // before  quering the database, and then queries the databse 
       
        const { data, error,  creditIDS} = this.state;

        event.preventDefault(); // prevent default rendering of the web page and
                // allows the user to filter  

        const target = event.target; // used to get user data from the html form
            // for each input field in the html form you can use the html name of the form to "index" the data
            // for example  here is an html input element : <input  id="creditIDLow" name="creditIDLow" type="number"  />
            // we can get the value the user inputed like so : var tempcreditIDLow = target.creditIDLow.value;


       

        // we can access a forms value by using its html name attribute to index it
        // for example: target.first.value or target["first"].value 
        // could get us the value of the first year form input value
        // where the html name="first"
        var FirstYearTemp = target.first.value;  // year range the user wishes to filter by
        var secondYearTemp = target.second.value;
        var tempcreditIDHigh = target.creditIDHigh.value; // allows user to create a custom credit id range to filter by 
        var tempcreditIDLow = target.creditIDLow.value;


        var areasSelected = []
        // allows user to selecte custom id ranges to filter by,
        // if the user wants to filter by a given  "credit id area" its checked value would be ture
        // if the specific area is true it gets pushed to the array areasSelected
        this.pushToArray(target.academics.checked, "academics", areasSelected)  
        this.pushToArray(target.engagement.checked, "engagement", areasSelected)  
        this.pushToArray(target.operations.checked, "operations", areasSelected)  
        this.pushToArray(target.p_and_a.checked, "p_and_a", areasSelected) 
        this.pushToArray(target.innovation.checked, "innovation", areasSelected) 




        // an array to hold all credit Id's the users wnats to use in filtering
        var selectedCreditIDS = []
        
        // loop over all credit ids and figure out which ids the user selected
        for(var i in creditIDS){ 

            var keyAsInt = parseInt(i) +1;
            // in the html code I dynamically create html names.
            // the name will always start with "id"
            // the enitire name will be a string concatenated with an int as a string
            var key = "id" + keyAsInt
          
            var currentBoxBool = target[key].checked; 
            // if the credit id was selected by the user, push it to the array 
            // to indicate it should be used when filtering
            if(currentBoxBool)
                selectedCreditIDS.push(keyAsInt); // push just the credit id to the array

        }
     
        

        // query the DB with data the user wishes to filter by
        axios.get('http://localhost:8080/filter_reporting_fields', 
                {params: { // all the parameters to pass to the api that queries the database & sends back data
                    years: [FirstYearTemp,secondYearTemp,], // a year range to filter by, its an array of 2 years
                    selectedCR_ID_Arr : selectedCreditIDS, // array of credit ids, are the credit ids the user selected in the credit id dropdown filter
                    CreditIDRanges : [tempcreditIDLow, tempcreditIDHigh], // a array of 2 credit ids, they together form a range of credit ids
                    areasSelected : areasSelected // an array of strings, that represent predefined credit ranges
                }}


            ).then((res, err) =>
            {
               
                
                if (err)
                {
                    this.setState({error: err});
                }
                else
                    {// get data from DB & update page thru state change
                    this.setState({data: res.data});
                    //var textOut = "data \n " + JSON.stringify(res.data); 
                    //console.log(textOut);
                   
                   
                    
                    }
                
            })
    };
  




 


   render(){
        //Get variables from state
        const {data, error, creditIDS} = this.state;


        //If data is [], returns loading
        if(!data || !creditIDS)
            return <h1>Loading</h1>;
        // If theres an error give a message.
        if(error)
            return <h1>An error occured</h1>
        return (


            <div className="bodyClass">
                <div className="left"> 

                    <h2> Filter Results </h2>
                   
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        
                            
                           
                        <hr/>
                          <label>
                            Credit ID Range <br/>
                            <input  id="creditIDLow" name="creditIDLow" type="number"  />
                            to 
                            <input id="creditIDHigh" name="creditIDHigh" type="number" />
                        </label>
                        <br/>
                        

                        <label>
                            Years Range <br/>
                            <input  id="first" name="first" type="number"  />
                            to 
                            <input id="second" name="second" type="number" />
                        </label>
                        <br/>


                        <hr/><br/>
                        <label > 
                            Academics (credits 1-11) <input  type="checkbox" name="academics" key="academics" value="academics" /> <br/>
                            Engagement (credits 12 - 27) <input  type="checkbox" name="engagement" key="engagement" value="engagement" /> <br/>
                            Operations (credits  28-55) <input  type="checkbox" name="operations" key="operations" value="operations" /> <br/>
                            P &amp; A (credits 56-70) <input  type="checkbox" name="p_and_a" key="p_and_a" value="p_and_a" /> <br/>
                            Innovation (credits 71-74) <input  type="checkbox" name="innovation" key="innovation" value="innovation" /> <br/>
                            &nbsp; &nbsp;   &nbsp; &nbsp;
                        </label>
                        <br/>



                        <label>
                        <button className="btn btn-primary" color="primary" onClick={this.collapseCreditFltr.bind(this)} >Filter by Credit Ids &#9660; </button>
                        <Collapse isOpened={this.state.fltrCatCollapseBool}>
                          
                          {creditIDS.map(
                                    (oneCreditID, index) => 
                                        <label key={index}> 
                                            {oneCreditID.toString()} : 
                                            <input  type="checkbox" name={"id"+oneCreditID.toString()} key={"id"+oneCreditID.toString()} value={oneCreditID.toString()} />
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


                    <p >Toggle Table Headers on/off </p>
                    <table > 
                        {/* this code inserts html check boxes into the top of the page. They are used to toggle headers on and off*/}
                        <tr>{headerFilterOptions.map(
                                (head, index) =>     
                                    <th><label key={head}> 
                                        {headersOptions[head]} : <input  type="checkbox" name={head} key={head} value={head} onClick={this.alterHeaders.bind(this, {head})} /> 
                                        &nbsp; &nbsp;   &nbsp; &nbsp;
                                    </label></th>
                            )}
                        </tr>
                    </table>
                    <hr/>
                    
                    
                    <Table>
                    <thead>
                    <tr> {/* use conditional rendering (notice the turnary operator) to determine if data shoulde be displayed. If a header is turned off render null, else render as usual*/}
                        {objectKeys.map(
                        (oneKey, index) =>  
                            
                                this.state.headerSelected[oneKey] ?  <th className={oneKey} key = {index}> {headersOptions[oneKey]}  </th>  : null  
                           
                        )}
                    </tr>
                    </thead>
                    <tbody>


                    {/* Map over all data indices, then objectKeys to display table. Notice the conditional rendering again.
                        Only display the data if the user toggled their respective headers on
                     */
                   
                    data.map((datum, index) => (
                        <tr key={index}>
                        {objectKeys.map((obj, index2) => (
                            
                                this.state.headerSelected[obj] ? <td key={index2}> {datum[obj]} </td>  : null
                            
                        ))}
                        </tr>
                    ))
                    }
                    </tbody>
                    </Table>


                </div>
            </div>
        )
    }








}
export default filterRoute;
