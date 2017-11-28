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
            const query = "SELECT * FROM reporting_fields order by years"
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
            const filterBuilt = filterHelper.buildFilter(jsonRecieved);
            //console.log(JSON.stringify(years)); 
            //console.log("myFilter" + myFilter)
            const query = "SELECT * FROM reporting_fields " + filterBuilt + " order by years";
            console.log(" query : " + query)
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                //console.log(result);
                res.json(result);
            })
        });


router.get('/get_categories', (req, res) =>{
            
            const query = "SELECT category FROM reporting_fields group by category";
            console.log("query " + query)
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                //console.log(result);
                res.json(result);
            })
        });


router.get('/title_questions', (req, res) =>{
            
            const query = "SELECT * FROM title_questions ";
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
            const query = "SELECT * FROM reporting_fields order by title_id"
            //console.log("in /reporting_fields api.jss")
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                var keys = Object.keys(result);
                //console.log(result);
                for (var index = 0; index < keys.length; index++){
                    var aKey = keys[index];
                    console.log("index : " + index)
                    console.log("aKey : " + aKey) 
                    console.log("aResult : " , result[aKey.toString()]);
                    var aResult = result[aKey.toString()];
                    //console.log("string : " + aKey)
                    var title_id = aResult["title_id"];
                    console.log("title_id : " , title_id);
                    console.log("title_id typeOf : " , typeof(title_id));
                    if(title_id === null || title_id === undefined || title_id == 'title_id')
                        title_id = "0";

                    if(title_id.toString() in resultDict){
                        // if index, exists, grab the nested array & push the new value onto it
                        resultDict[title_id].push(aResult);

                    }
                    else{
                        // else the index doesnt exist and the new nested array needs to be created
                        var temp = [];
                        temp.push(aResult);
                        resultDict[title_id] = temp;

                    }



                }

                result = resultDict;
                res.json(result);
            })
        });






app.use(router);
module.exports = app;
