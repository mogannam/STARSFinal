

// https://www.npmjs.com/package/axios // good axios article

import React, {Component} from 'react';
import axios from 'axios'
import {Table} from 'react-bootstrap'
import {Collapse} from 'react-collapse';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';

//import ReactDOM from 'react-dom'



import '../filterRoute.css'

//Table headers in array
/*const headers = [
    "question" , 
    "answer", 
    "year", 
    "credit_id", 
    "title",
    "q_id",
    "Category"

];*/


// ana array of all headers the user can toggle on and off in the table displayed
// this seperate array is similar to objectKeys, but it needs it own copy because
// by removing elements from this array allows the designer to force what is 
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
// table displayed to the user
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
            categories: [], // holds the categories to filter by, obtained from mysql query
            FirstYear : "",
            secondYear: "", 
            fltrCatCollapseBool: false, // used to control wheter to open/close filter by category drop down tab
            //headers : ["question" ,  "answer",  "years",  "credit_id",  "title_id", "q_id", "category"], // old method
            headers : objectKeys.map( (key,index) =>  headersOptions[key] ), // used to change which headers are shown to the user
                    // if the user toggles headers on/off -> than elemens will be pushed or removed from the array
                    // of displayed headers.
            headerSelected : TrueDictionary() // assign a boolean dictionary, to indicate all headers should be shown
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
        console.log("headerSelected", this.state.headerSelected )


    
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
                returnData.push(tempData[i]["cr_ID"])
            }

            //console.log(returnData);

            //console.log("returnData ",returnData);
            this.setState({categories: returnData}, );

            
            }
    })



      
   
           
    };
    



    collapseCatFltr(event){
        // an event handler that allows the user to open/close the categories filter tab
        event.preventDefault(); // called to prevent the default rendering of the page
                // needed b/c otherwise it will query the DB for all the data
                // and prevent the user from filtering.


        this.setState({fltrCatCollapseBool: !this.state.fltrCatCollapseBool});
    }

    alterHeaders(selected, event){
        event.preventDefault(); 
        
        var headSelected = selected["head"];
           
        var target = event.target

        var {headers, headerSelected } = this.state;
        


        headerSelected[headSelected] = !headerSelected[headSelected]
        

        /*
        var tempHeader = []
        if(headerSelected[headSelected]){ // if user clicked to remove header
            for ( var index in headers){
                var oneElement = headers[index]

                console.log(oneElement)
                if (oneElement !== headSelected)
                    tempHeader.push(oneElement);
            }
            headers = tempHeader;
        }
        else // insert new header
            {

                headers.push(headSelected);  
             
            }
            */





        this.setState({headerSelected : headerSelected , headers : headers});
        





    }


    pushToArray(boolValue, whatToPush, arr){
        if(boolValue)
            arr.push(whatToPush);
        return arr;
    }



    handleSubmit(event) { 
        // event handler that bundles up all the filtering data 
        // before  quering the database
        const { data, error, FirstYear, secondYear, categories} = this.state;

        event.preventDefault(); // prevent default rendering of the web page and
                // allows the user to filter  

        const target = event.target;

        // years the user wishes to filter by

        // we can access a forms value by using its html name attribute to index it
        // for example: target.first.value or target["first"].value 
        // could get us the value of the first year form input value
        // where the html name="first"
        var FirstYearTemp = target.first.value;
        var secondYearTemp = target.second.value;
        var tempcreditIDHigh = target.creditIDHigh.value;
        var tempcreditIDLow = target.creditIDLow.value;


        var areasSelected = []
        this.pushToArray(target.academics.checked, "academics", areasSelected)  
        this.pushToArray(target.engagement.checked, "engagement", areasSelected)  
        this.pushToArray(target.operations.checked, "operations", areasSelected)  
        this.pushToArray(target.p_and_a.checked, "p_and_a", areasSelected) 
        this.pushToArray(target.innovation.checked, "innovation", areasSelected) 




        // an array to hold all credit Id's the users wnats to use in filtering
        var selectedCategories = []
        //console.log("categories ", categories)

        for(var i in categories){
            //console.log( categories[i] + " : "+ target[categories[i]].checked)
            // for each checked box get the boolean  to determine if its checked
            //console.log("in handle submit i ", i, "  categories[i] ", categories[i], typeof(categories[i].toString() ) )
            var keyAsInt = parseInt(i) +1;
            var key = "id" + keyAsInt
          
            var currentBoxBool = target[key].checked;
            if(currentBoxBool)
                selectedCategories.push(keyAsInt);

        }
     
        

        // query the DB with data the user wishes to filter by
        axios.get('http://localhost:8080/filter_reporting_fields', 
                {params: {
                    years: [FirstYearTemp,secondYearTemp,],
                    selectedCR_ID_Arr : selectedCategories,
                    CreditIDRanges : [tempcreditIDLow, tempcreditIDHigh],
                    areasSelected : areasSelected
                }}


            ).then((res, err) =>
            {
               
                
                if (err)
                {
                    this.setState({error: err});
                }
                else
                    {// get data from DB & update page thru state change
                    this.setState({data: res.data, FirstYear: FirstYearTemp, secondYear: secondYearTemp, creditIDHigh: tempcreditIDHigh, creditIDLow: tempcreditIDLow});
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
        if(!data || !categories)
            return <h1>Loading</h1>;
        // If theres an error give a message.
        if(error)
            return <h1>An error occured</h1>
        return (


            <div>
                <div className="left"> 
                   
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        
                            <p>Choose the data you want displayed:</p> 
                            {headerFilterOptions.map(
                                (head, index) => 
                                    
                                    <label key={head}> 
                                        {headersOptions[head]} : <input className={(index+1)%3 === 0 ? "newlineclass" : null } type="checkbox" name={head} key={head} value={head} onClick={this.alterHeaders.bind(this, {head})} /> 
                                        &nbsp; &nbsp;   &nbsp; &nbsp;

                                    </label>
                                    
                                     
                                )}
                           
                        <hr/><br/><br/>

                          <label>
                            Credit ID Range Range: <br/>
                            <input  id="creditIDLow" name="creditIDLow" type="number"  />
                            to 
                            <input id="creditIDHigh" name="creditIDHigh" type="number" />
                        </label>
                        <br/>
                        

                        <label>
                            Years Range: <br/>
                            <input  id="first" name="first" type="number" value3={this.state.FirstYear} />
                            to 
                            <input id="second" name="second" type="number" value4={this.state.secondYear}/>
                        </label>
                        <br/>


                        <hr/><br/>
                        <label > 
                            Academics (credits 1-11): <input  type="checkbox" name="academics" key="academics" value="academics" /> <br/>
                            Engagement (credits 12 - 27): <input  type="checkbox" name="engagement" key="engagement" value="engagement" /> <br/>
                            Operations (credits  28-55): <input  type="checkbox" name="operations" key="operations" value="operations" /> <br/>
                            P &amp; A (credits 56-70): <input  type="checkbox" name="p_and_a" key="p_and_a" value="p_and_a" /> <br/>
                            Innovation (credits 71-74): <input  type="checkbox" name="innovation" key="innovation" value="innovation" /> <br/>
                            &nbsp; &nbsp;   &nbsp; &nbsp;
                        </label>
                        <br/>



                        <label>
                        <button className="btn btn-primary" color="primary" onClick={this.collapseCatFltr.bind(this)} >Filter by Credit Ids &#9660; </button>
                        <Collapse isOpened={this.state.fltrCatCollapseBool}>
                          
                          {categories.map(
                                    (oneCategory, index) => 
                                        <label key={index}> 
                                            {oneCategory.toString()} : 
                                            <input  type="checkbox" name={"id"+oneCategory.toString()} key={"id"+oneCategory.toString()} value={oneCategory.toString()} />
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
                        {objectKeys.map(
                        (oneKey, index) =>  
                            
                                this.state.headerSelected[oneKey] ?  <th className={oneKey} key = {index}> {headersOptions[oneKey]}  </th>  : null  
                           
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {/* Map over all data indices, then objectKeys to display table */
                   
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
