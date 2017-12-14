/**
 * Created by KurtGranborg on 11/6/2017.
 */
import mysql from 'mysql';
export const connection = mysql.createConnection({
    host: 'blue.cs.sonoma.edu',//'127.0.0.1',
    user: 'csisomphou',//'root',
    password: '004165166',//'asdf',
    database: 'stars'
});