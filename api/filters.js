module.exports = {

buildFilter: function (jsonRecieved){
    var stringOfFilters = []


   /* const yearsFilterStr = this.filterYear(jsonRecieved.years);

    const catFilterStr = this.filterCategory(jsonRecieved.selectedCR_ID_Arr);
    const creditIDFilterStr  = this.filterCreditID(jsonRecieved.CreditIDRanges);
    //console.log("creditIDlow " + jsonRecieved.selectedCreditIDs[0])
    console.log(creditIDFilterStr);*/

    //stringOfFilters.push(this.filterCreditID(jsonRecieved.selectedCreditIDs));

    const crIDandAreaFltrStr = this.filterCRidAndArea(jsonRecieved);
    
    //stringOfFilters.push(this.filterCategory(jsonRecieved.selectedCategories));
    //console.log(stringOfFilters);

    //console.log("filterCRidAndArea : ", this.filterCRidAndArea(jsonRecieved));

    stringOfFilters.push(this.filterYear(jsonRecieved.years));
    stringOfFilters.push(this.filterCRidAndArea(jsonRecieved));

    var returnFilter = "";

    // get only valid filters that are not ""
    var tempArray = []
    for(var i = 0; i < stringOfFilters.length; i++ )
        if(stringOfFilters[i] !== "")
            tempArray.push(stringOfFilters[i]);
    stringOfFilters = tempArray;
    //console.log("after removing empty filters " + stringOfFilters);

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
        returnFilter += stringOfFilters[0];
        //console.log("in if statement array " + stringOfFilters )
        for(var i = 1; i < stringOfFilters.length; i++ )
            returnFilter += " and (" + stringOfFilters[i] + ")";

    }

    //console.log("last result of filter : " + returnFilter);

    /*
    // if filter is not null append the where clause only;
    
    if(yearsFilterStr !== "")
        returnFilter = "where " + yearsFilterStr

    */
    
    return returnFilter;

},

pushToArray(boolValue, whatToPush, arr){
        if(boolValue)
            arr.push(whatToPush);
        return arr;
    },


filterCRidAndArea: function(jsonRecieved){
    // takes in the input from the form submission
    // this function builds up a set of related subfilters into one filter
    var returnString =""
    const creditIdString = this.filterCreditIDRange(jsonRecieved.CreditIDRanges)
    const selectCR_IDString = this.filterSelectCreditIds(jsonRecieved.selectedCR_ID_Arr)
    const areaString = this.filterArea(jsonRecieved.areasSelected)


    var arrSubFilter = []
    this.pushToArray((creditIdString != ""), creditIdString, arrSubFilter)
    this.pushToArray((selectCR_IDString != ""), selectCR_IDString, arrSubFilter)
    this.pushToArray((areaString != ""), areaString, arrSubFilter)


    if(arrSubFilter.length <= 0 || arrSubFilter === undefined)
        return returnString = ""
    if(arrSubFilter.length === 1)
        returnString = arrSubFilter[0]
    else if (arrSubFilter.length > 1){
            returnString = arrSubFilter[0]
            for(var i = 1; i < arrSubFilter.length; i++ ){
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
        for(var i = 1; i < areaArray.length; i++ ){
            returnString += " or " + areaDict[areaArray[i]]
        }
    }
    
    
    //console.log("returnString is : " + returnString);
    return "("+returnString+")"


},

filterCreditIDRange: function(creditIDArray){
    // takes in two id ranges a high and a low
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
    // takes in an array with strings of credit ids
    var returnString = "";

    if(catArray === undefined)
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