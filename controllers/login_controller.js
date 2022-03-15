const DM = require('./db_controller');
const HF = require('./helper');
const VD = require('./validator');
const bcrypt = require('bcrypt');
const moment = require('moment');
var express = require('express');
const session = require('express-session');


let authController = class {
    constructor() {
        this.DB = new DM();
        this.HF = new HF();
        this.VD = new VD();
    }

    // Method to render login page
    loginPage(req, res) {
        res.render('auth/login');
    };

    // Method to authenticate and logIn User
    logIn = async (req, res) => {
        let { username, pass } = req.body
        let param1 = ["*"];
        let param2 = "users";
        let param3 = { "email": username + "/", "username": username };
        var sql = this.DB.generateSelectSQL(param1, param2, param3);
        console.log(sql)
        var User = await this.DB.runSQLQuery(sql);

        if (User.length > 0 && User[0].is_active == '1') {
            bcrypt.compare(pass, User[0].password, async (err, reslt) => {
                if (err) {
                    res.json({ error: 'Invalid Credentials! Please trys again.' });
                }
                else if (reslt == true) {
                    let datetime = moment().format('YYYY-MM-DD  HH:mm:ss.000');
                    let param1 = "users";
                    let param2 = { "last_login": datetime };
                    let param3 = { "user_id": User[0].user_id };
                    var sql = this.DB.generateUpdateSQL(param1, param2, param3);
                    await this.DB.runSQLQuery(sql);

                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.user_id = User[0].user_id;
                    req.session.role = User[0].user_type;

                    let subj = username + " Logged in at " + datetime;
                    let det = {
                        "activity_type": "user_login", "title": subj,
                        "category": "users", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };
                    this.HF.setActivity(det);


                    res.json({ success: 'Login Details Correct', url: "/admin", msg: "Valid Credentials" });
                }
                else {
                    res.json({ error: 'Invalid Credentials! Please try again.' });
                }
            });


        } else {
            res.json({ error: 'Invalid Credentials! Please try again.' });
        }

    }

    // Method to authenticate and Register User
    registerUser = async (req, res) => {

        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "user_id": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1' && (User[0].user_type == "Admin")) {
                var data = {};
                var [blah, state, msg] = await this.VD.validUser(req);

                if (state) {
                    let param1 = "users";
                    let det;

                    if (req.body.type == "add") {
                        let param2 = {
                            "user_id": blah.id, "fname": req.body.fname, "lname": req.body.lname,
                            "username": req.body.username, "email": req.body.email, "phone": req.body.phone,
                            "gender": req.body.gender, "user_type": req.body.user_type, password: blah.hash,
                            "address": req.body.address, "is_active": "0", "uid": blah.uid
                        };
                        let param3 = param2;
                        var sql = this.DB.generateInsertSQL(param1, param2, param3);

                        let subj = "Registered " + req.body.username + " " + req.body.user_type + " User"
                        det = {
                            "activity_type": "user_register", "title": subj,
                            "category": "users", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                        };
                    } else {
                        let param2 = {
                            "fname": req.body.fname, "lname": req.body.lname, "username": req.body.username,
                            "email": req.body.email, "phone": req.body.phone, "gender": req.body.gender,
                            "user_type": req.body.user_type, password: blah.hash,
                            "address": req.body.address
                        };
                        console.log(param2);
                        let param3 = { "id": req.body.ID };
                        var sql = this.DB.generateUpdateSQL(param1, param2, param3);

                        let subj = "Updated " + req.body.username + " " + req.body.user_type + " User"
                        det = {
                            "activity_type": "user_update", "title": subj,
                            "category": "users", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                        };
                    }
                    await this.DB.runSQLQuery(sql);
                    this.HF.setActivity(det);

                    data.success = msg.message;
                    res.json(data)
                } else {
                    data.error = msg.message;
                    res.json(data)
                }
            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }

    }

    // Methof to logout User
    logOut = (req, res,) => {
        let subj = req.session.username + " " + req.session.role + " User Logged out"
        let det = {
            "activity_type": "user_logout", "title": subj,
            "category": "users", "activity_by": req.session.username
        };
        this.HF.setActivity(det);
        req.session.loggedin = false;
        req.session.username = "";
        req.session.role = "";

        res.redirect("/auth/login");
    }

}

module.exports = authController