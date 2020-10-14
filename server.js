const mysql = require('mysql');
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express()
const port = 3000;
const mongoClient = require("mongodb").MongoClient;
const WS = require('ws');
require('dotenv').config();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(process.env.PORT || port, () => {
    console.log(`Listening!!`)
})


const conn = mysql.createConnection({
    host: process.env.SQLHost,
    user: process.env.SQLUser,
    password: process.env.SQLPassword,
    database: process.env.SQLDB,
    port: 3306,
    ssl: {
        ca: fs.readFileSync('BaltimoreCyberTrustRoot.crt.pem')
    }
});

let sqlResults, mongoResults;
app.get('/', (req, res) => {

    sqlResults.forEach((entry) => mongoResults.push(entry))
    mongoResults.sort((a, b) => {
        return new Date(a.entrydate) - new Date(b.entrydate)
    });

    res.render(
        "index.ejs", {
            entries: mongoResults
        }
    );

});

app.post('/', (req, res) => {

    switch (req.body.db) {
        case 'mysql':
            sqlInsert(req.body)
            break;

        case 'cosmos':
            docInsert(req.body)
            break;

        default:
            break;
    }
    res.status(204).send();
});

function getSQLResults(err, results) {
    if (err) throw err;
    else sqlResults = results;
}

function getMongoResults(err, client) {
    client.db('guestbook').collection('entries').find().toArray()
        .then(e => { mongoResults = e });
}

function sqlInsert(entry) {
    console.log('Inesrt into mysql');
    conn.query('INSERT INTO guestbook (sender, message) VALUES (?, ?);', [entry.sender, entry.message],
        function (err, results, fields) { if (err) throw err;});
}

function docInsert(entry) {
    console.log('Inesrt into cosmos');
    mongoClient.connect(process.env.CosmosConn, function (err, client) {
        client.db('guestbook').collection('entries').insertOne({
            "entrydate": Date(),
            "sender": entry.sender,
            "message": entry.message,
            "isCosmos": true
        }, function (err, result) {});
    });
}

const WSS = new WS.Server({
    port: 443
});

WSS.on('connection', socket => {
    console.log('Server connected!');

    socket.on('message', msg =>  {
        WSS.clients.forEach(function (client) {
            if (client.readyState === WS.OPEN) {
                client.send(msg);
            }
        });
    });
});

WSS.on('upgrade', (req, socket, head) => {
    WSS.handleUpgrade(req, socket, head, ws => {
        WSS.emit('connection', ws, req);
    })
});

conn.connect(err => {
    if (err) {
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    } else {
        console.log("MySQL connection established!");
        //Grab Database records when MySQL is connected
        conn.query('SELECT * FROM guestbook', getSQLResults);
        mongoClient.connect(process.env.CosmosConn, getMongoResults);
    }
});