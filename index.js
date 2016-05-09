;(function(){
	"use strict";
	
	var PORT = 3000;
	
	var fs = require('fs');
	
	var express = require('express');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var expressSession = require('express-session');
	
	var config = require('./config.js');
	
	var app = express();
	
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(cookieParser());
	app.use(expressSession({
		secret: config.secret,
		resave: true,
    	saveUninitialized: true
	}));
	
	var messages = ["This is a message", "This is another message"];
	var users = [];
    var testUser = [{
        username: "mark",
        password: "password"
    },
    {
        username: "guest",
        password: "password"
    },
    {
        username: "sean",
        password: "password"
    }
    ];
    
    for (var i = 0; i< testUser.length; i++){
        users.push(testUser[i]);
    }
	app.get("/", function(req, res) {
		if (!req.session.username) {
			res.redirect("/login");
			return;
		}
		
		res.sendFile(__dirname + "/public/index.html");
	});
	
	app.get("/messages", function(req, res){
		if (!req.session.username) {
			res.send("[]");
			return;
		}
		
		res.send(JSON.stringify(messages));
	});
	
	app.post("/messages", function(req, res){
		if (!req.session.username) {
			res.send("error");
			return;
		}
		
		if(!req.body.newMessage){
			res.send("error");
			return;
		}
		messages.push(req.session.username + ": +" + req.body.newMessage);
		res.send("success");
	});
	
	
	
	app.get("/login", function(req, res){
		res.sendFile(__dirname + '/public/login.html');
	});
	
	function logInUser(username, password, users) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].username == username && users[i].password == password){
                return true;
            }
        }
//		if (username == "erty" && password == "password") {
//			return true;
//		} else if (username == "guest" && password == "guest") {
//			return true;
//		}
		return false;
	}
	
	app.post("/login", function(req, res){
		if(req.body.username && req.body.password){
			if (logInUser(req.body.username, req.body.password, users)){
				req.session.username = req.body.username;
				res.redirect("/");
				return;
			}
		}
		res.redirect("/login");
	});
	function createNewUser(username, password, pwconfirm, users) {
        console.log("Please God Work");
        for (var i = 0; i < users.length; i++) {
            if (users[i].username == username) {
                return "ERROR";
            }
            if (users.indexOf(users[i].username) == -1){
                var test = new newUsers(username, password, pwconfirm);
                users.push(test);
                return;
            }
        }
    }
    
    function newUsers(username, password, pwconfirm) {
        this.username = username;
        this.password = password;
        this.pwconfirm = pwconfirm;
    }
    //ADD NEW USER
    app.get('/create', function(req, res){
        res.sendFile(__dirname + '/public/create.html');
    });
    app.post('/create', function(req, res){
        if (req.body.username && req.body.password && req.body.pwconfirm){
            if (req.body.password == req.body.pwconfirm){
                createNewUser(req.body.username, req.body.password, req.body.pwconfirm, users);
                req.session.username = req.body.username;
                res.redirect("/login");
                return;
                
            }
            else {
                res.send("passwords don't match");
            }
        }
    })
	app.use(express.static('public'));
	
	app.use(function(req, res, next) {
		res.status(404);
		res.send("File not found");
	});
	
	app.listen(PORT, function() {
		console.log("server started on port " + PORT);
	});
	
}());









