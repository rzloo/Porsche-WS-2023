const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
const mysql = require('mysql2');
const mqtt = require("mqtt");
var studentArray = [];
const client = mqtt.connect("mqtt://192.168.178.26");

client.on('connect', function () {
	console.log(`Client connected to Mosquitto: ${client.connected}`);
	client.subscribe("NameChanges");
});

client.on("message", (topic, message) => {
	var newStudentValues = JSON.parse(message);
	connection.query("UPDATE students SET firstname = '" + newStudentValues.firstname + "' WHERE students.id = '" + newStudentValues.id +"'");
});

var connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "admin",
	password: "admin",
	port: 3306,
	database: "studentsDB"
});

app.get("/", function(req, res) {
	connection.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	});
	connection.query("SELECT * FROM students", function(error,resultList){
		studentArray = resultList;
		console.log(resultList);
		res.render('pages/studenList', {
			inputStudentArray : studentArray
		});
	});


});

app.listen(80);
console.log('Server is listening on port 80');
