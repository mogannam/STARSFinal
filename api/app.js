/**
 * Created by KurtGranborg on 11/6/2017.
 */
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import https from "https";
import {connection} from "./connection";


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

app.use(router);
module.exports = app;
