/**
 * Created by KurtGranborg on 11/6/2017.
 */
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import https from "https";
import {connection} from "./connection";
const filterHelper = require("./filters.js");


const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors());




//Connect to mySql
connection.connect(function(err){
    if(err){
        console.log('Could not connect to database');
    }else{
        console.log('Connected to database');
    }
});

const router = express.Router();

router.get('/students', (req, res) =>{
    const query = "SELECT * FROM students LIMIT 0,20"
    connection.query(query, function (err, result) {
        if (err)
            res.send(err);
        res.json(result);
    })
});


 router.get('/question', (req, res) =>{
            const query = "SELECT * FROM questions"
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                res.json(result);
            })
        });

router.get('/reporting_fields', (req, res) =>{
            const query = "SELECT * FROM report_credit_view order by cr_ID , question_ID  , year "
            //console.log("in /reporting_fields api.jss")
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                //console.log(result);
                res.json(result);
            })
        });





router.get('/filter_reporting_fields', (req, res) =>{
            
            const jsonRecieved = req.query;
            console.log(jsonRecieved);
            const filterBuilt = filterHelper.buildFilter(jsonRecieved);
            //console.log(JSON.stringify(years)); 
            //console.log("myFilter" + myFilter)
            const query = "SELECT * FROM report_credit_view " + filterBuilt + " order by cr_ID,  question_ID , year";
            console.log(" query : " + query)
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                //console.log(result);
                res.json(result);
            })
        });


router.get('/get_categories', (req, res) =>{
            
            const query = "SELECT cr_ID FROM report_fields group by cr_ID";
            console.log("query " + query)
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                //console.log(result);
                res.json(result);
            })
        });


router.get('/title_questions', (req, res) =>{
            
            const query = "SELECT * FROM q_titles ";
            console.log("query " + query)
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                //console.log(result);
                res.json(result);
            })
        });





router.get('/reporting_fields2', (req, res) =>{
            var resultDict= {}; // declare Dictionary of arrays, each nested array contains mysql dictionary elements
            const query = "select credit_info.*, area_info.area_abbr, area_info.area_title from credit_info" 
                + " left join area_info on credit_info.area_ID = area_info.area_ID"
                + " order by area_ID ;";
            //console.log("in /reporting_fields api.jss")
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                var keys = Object.keys(result);
                //console.log("result keys ", keys);
                //console.log(result);
                
                for (var index = 0; index < result.length; index++){
                    
                    var aResult = result[index];
                    //console.log("string : " + aKey)
                    var area_ID = aResult["area_ID"];
                    area_ID = area_ID.toString()
                    
                    if(area_ID === null || area_ID === undefined || area_ID == 'area_ID')
                        area_ID = "0";
                    
                    if(area_ID.toString() in resultDict){
                        // if index, exists, grab the nested array & push the new value onto it
                        resultDict[area_ID].push(aResult);

                    }
                    else{
                        // else the index doesnt exist and the new nested array needs to be created
                        var temp = [];
                        temp.push(aResult);
                        resultDict[area_ID] = temp;

                    }



                }

                result = resultDict;
                //console.log(result)
                res.json(result);
            })
        });






app.use(router);
module.exports = app;
