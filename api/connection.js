/**
 * Created by KurtGranborg on 11/6/2017.
 */
import mysql from 'mysql';
export const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'asdf',
    database: 'new_ssu_schema'
});