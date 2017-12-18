module.exports = {

    // js code to build a partial mysql query to help filter data
    // based on user input

buildFilter: function (jsonRecieved){

    // because we don't know which "filters" the user will use
    //  we need to track all of them in an array. 
    // Each "filter" represents a partial mysql query. 
    // Eventually each filter  gets combined thru
    // an "AND" or an "OR" to make all the partial filters one large filter.
    var stringOfFilters = []


  
    // because there are currently 3 filters that deal with credit id, we need to allow
    // all of them to be used. The three filter filter by 
    // credit id range, predefined credit id ranges, and by a list of credit ids the user selected.
    //To do this each of these 3 filters will be a sub filter
    // that will be combined to become one large filter.
    //stringOfFilters.push(this.filterCRidAndArea(jsonRecieved));
    var tempFilter1 = this.filterCRidAndArea(jsonRecieved)
    // only allow the filter thru if its valid,
    this.pushToArray(tempFilter1 !== "", tempFilter1, stringOfFilters)

    
    // build the year filter
    //stringOfFilters.push(this.filterYear(jsonRecieved.years));
    var tempFilter2 = this.filterYear(jsonRecieved.years)
    // only allow the filter thru if its valid,
    this.pushToArray(tempFilter2 !== "", tempFilter2, stringOfFilters)

    
    var returnFilter = ""; // will hold the final filter, a combination of all filters

    

    // if not filtering return empty string
    if(stringOfFilters.length <= 0)
        returnFilter = "";
    else // else we are filtering and need to start with where
        returnFilter = "where ";

    if(stringOfFilters.length === 1){ // if only 1 filter exists
        if(stringOfFilters[0] !== "")//make sure a filter actually exists
            returnFilter += stringOfFilters[0];
    }
    else if(stringOfFilters.length > 1 ){
        // else multiple filters exist and need to be concatenated
        returnFilter += stringOfFilters[0];// get first filter
        for(var i = 1; i < stringOfFilters.length; i++ ) // loop over all filters starting at 2nd filter
            returnFilter += " and (" + stringOfFilters[i] + ")";
    }
    
    return returnFilter;

},

pushToArray(boolValue, whatToPush, arr){
        // conditionally push to array
        if(boolValue) // if tru push, if false do nothing
            arr.push(whatToPush);
        return arr;
    },


filterCRidAndArea: function(jsonRecieved){
    // takes in the input from the form submission
    // this function builds up a set of related subfilters into one filter
    // builds a filter that involves all credit id sub filters
    
    var returnString =""
    
    // get all sub filters so that we can combined them with an or
    const creditIdString = this.filterCreditIDRange(jsonRecieved.CreditIDRanges)
    const selectCR_IDString = this.filterSelectCreditIds(jsonRecieved.selectedCR_ID_Arr)
    const areaString = this.filterArea(jsonRecieved.areasSelected)


    var arrSubFilter = []
    // only psuh subfilters that are valid
    this.pushToArray((creditIdString != ""), creditIdString, arrSubFilter)
    this.pushToArray((selectCR_IDString != ""), selectCR_IDString, arrSubFilter)
    this.pushToArray((areaString != ""), areaString, arrSubFilter)


    if(arrSubFilter.length <= 0 || arrSubFilter === undefined)
        return returnString = "" // if no filters exist return nothing
    if(arrSubFilter.length === 1)
        returnString = arrSubFilter[0] // if one filter exists return it
    else if (arrSubFilter.length > 1){// else multiple filters exist
            returnString = arrSubFilter[0] //get first filter
            for(var i = 1; i < arrSubFilter.length; i++ ){ // loop over all other filters and combined them
                returnString += " or " + arrSubFilter[i]
            }

        }

    return returnString;



},

filterArea: function(areaArray){
    // takes in an array of strings
    // each strings represents a specific area
    // an area is a representation of fixed credit ranges

    var returnString = "";
    var areaDict = {
    'academics':    "(cr_ID >= 1 and cr_ID <= 11)",
    'engagement' :  "(cr_ID >= 12 and cr_ID <= 27)",
    'operations' :  "(cr_ID >= 28 and cr_ID <= 55)",
    'p_and_a':      "(cr_ID >= 56 and cr_ID <= 70)",
    'innovation':   "(cr_ID >= 71 and cr_ID <= 74)"
    }


    // if user is not filtering by aread
    if(areaArray === undefined)
        return returnString = ""
    if(areaArray.length === 1) // if user is only filtering by one area
        returnString = areaDict[areaArray[0]]
    else if(areaArray.length > 1){ // else user filters by 2+ areas
         returnString = areaDict[areaArray[0]]
        for(var i = 1; i < areaArray.length; i++ ){ // combined all filters
            returnString += " or " + areaDict[areaArray[i]]
        }
    }
    
    //console.log("returnString is : " + returnString);
    return "("+returnString+")"


},

filterCreditIDRange: function(creditIDArray){
    // takes in two id ranges a high and a low
    // build a custom id range to filter by
    var returnString = ""
    const lowID = creditIDArray[0];
    const highID = creditIDArray[1];

     // if neither credit id values are valid
    if (lowID === "" && highID === "" )
        return "";
    // if both credit ids are valid
    else if (lowID !== "" && highID !== "")
        returnString = "cr_ID >= " + lowID + " and cr_ID <= " + highID;
    else // else only one credit id is filled out
        if(lowID !== "")
            returnString = "cr_ID >= " + lowID;
        else if(highID !== "")
            returnString = "cr_ID <= " + highID;
    
    //console.log("in filter Years functions : " + returnString);     

    return "("+returnString+")"


},



filterSelectCreditIds: function (catArray){
    // takes in an array with  a list of string credit ids
    var returnString = "";

    if(catArray === undefined) // if array is empty or undefined
        return returnString = ""
    if(catArray.length === 1) 
        returnString = "cr_ID = " + "'" +catArray[0] + "'";
    else if(catArray.length > 1){
         returnString = "cr_ID = " + "'"+catArray[0]+"'";
        for(var i = 1; i < catArray.length; i++ ){
            returnString += " or cr_ID = " + "'"+catArray[i]+"'";
        }
    }
    
    
    //console.log("returnString is : " + returnString);
    return "("+returnString+")"

},

filterYear: function  (yearsArray){
    // takes in an array with two years represented as strings

    // event.preventDefault();   
    var returnString = ""
    const firstYear = yearsArray[0];
    const secondYear = yearsArray[1];

    // if neither year values are valid
    if (firstYear === "" && secondYear === "" )
        return "";
    // if both years are valid
    else if (firstYear !== "" && secondYear !== "")
        returnString = "year >= " + firstYear + " and year <= " + secondYear;
    else // else only one year is filled out
        if(firstYear !== "")
            returnString = "year >= " + firstYear;
        else if(secondYear !== "")
            returnString = "year <= " + secondYear;
    
    //console.log("in filter Years functions : " + returnString);     

    return "("+returnString+")"

},



}