module.exports = {

buildFilter: function (jsonRecieved){
    var stringOfFilters = []


    const yearsFilterStr = this.filterYear(jsonRecieved.years);

    const catFilterStr = this.filterCategory(jsonRecieved.selectedCategories);
    //console.log("years " + yearsFilterStr)
    //console.log("category " + catFilterStr)

    stringOfFilters.push(this.filterYear(jsonRecieved.years));
    stringOfFilters.push(this.filterCategory(jsonRecieved.selectedCategories));
    //console.log(stringOfFilters);

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
        returnString = "years >= " + firstYear + " and years <= " + secondYear;
    else // else only one year is filled out
        if(firstYear !== "")
            returnString = "years >= " + firstYear;
        else if(secondYear !== "")
            returnString = "years <= " + secondYear;
    
    //console.log("in filter Years functions : " + returnString);     

    return returnString

},

filterCategory: function (catArray){
    // takes in an array with strings of categories
    var returnString = "";

    if(catArray === undefined)
        return returnString = ""
    if(catArray.length === 1) 
        returnString = "category = " + "'" +catArray[0] + "'";
    else if(catArray.length > 1){
         returnString = "category = " + "'"+catArray[0]+"'";
        for(var i = 1; i < catArray.length; i++ ){
            returnString += " or category = " + "'"+catArray[i]+"'";
        }
    }
    
    
    //console.log("returnString is : " + returnString);
    return returnString

},



}