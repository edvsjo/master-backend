// make a simple backend that connects to the postgres database

const express = require('express');
const app = express();
const Pool = require('pg').Pool;

// Database config
const config = require('./db');

const pool = new Pool(config.database);

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
 
 
pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error(
                'Error executing query', err.stack)
        }
        console.log("Connected to Database !")
    })
})
 
app.get('/testdata', (req, res, next) => {
    console.log("TEST DATA :");
    pool.query('Select * from scan_result fetch first 10 rows only;')
        .then(testData => {
            console.log(testData);
            res.send(testData.rows);
        })
})

app.get('/monthlyScan/:year/:month', (req, res, next) => {
    console.log("MONTHLY DATA :");
    const year = req.params.year;
    const month = req.params.month;
    let result;
    pool.query(`select * from scan_result where extract(year from time) = $1 and extract(month from time) = $2;`, [year, month])
        .then(testData => {
            console.log(testData);
            result = parseMonthlyScan(testData.rows);
            res.set('Access-Control-Allow-Origin', '*');
            res.send(result);
        })
})

const parseMonthlyScan = (result) => {
    let tls13_support_count = 0
    let tls12_support_count = 0
    let tls11_support_count = 0
    let tls10_support_count = 0
    let ssl3_support_count = 0
    let ssl2_support_count = 0

    for (let i = 0; i < result.length; i++) {
        if (result[i].tls1_3_support) tls13_support_count++;
        if (result[i].tls1_2_support) tls12_support_count++;
        if (result[i].tls1_1_support) tls11_support_count++;
        if (result[i].tls1_0_support) tls10_support_count++;
        if (result[i].ssl3_support) ssl3_support_count++;
        if (result[i].ssl2_support) ssl2_support_count++;
    }
    console.log("TLS 1.3 support count: " + tls13_support_count);
    console.log("TLS 1.2 support count: " + tls12_support_count);
    console.log("TLS 1.1 support count: " + tls11_support_count);
    console.log("TLS 1.0 support count: " + tls10_support_count);
    console.log("SSL 3.0 support count: " + ssl3_support_count);
    console.log("SSL 2.0 support count: " + ssl2_support_count);
    return {
        tls13_support_count: tls13_support_count,
        tls12_support_count: tls12_support_count,
        tls11_support_count: tls11_support_count,
        tls10_support_count: tls10_support_count,
        ssl3_support_count: ssl3_support_count,
        ssl2_support_count: ssl2_support_count
    }

}
// Require the Routes API  
// Create a Server and run it on the port 3000
const server = app.listen(3001, function () {
    let host = server.address().address
    let port = server.address().port
    // Starting the Server at the port 3000
})
