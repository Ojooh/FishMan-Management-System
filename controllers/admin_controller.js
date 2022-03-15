const DM = require('./db_controller');
const HF = require('./helper');
const VD = require('./validator');
const moment = require('moment');
var express = require('express');
const session = require('express-session');


let adminControllerClass = class {
    constructor() {
        this.DB = new DM();
        this.HF = new HF();
        this.VD = new VD();
    }

    getDashboard = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1') {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.dash = "active"
                let title = "Dashboard";


                let context = { user: User[0], sidebar: sb, title: title };
                res.render('admin/index', context);

            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    getUsers = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1' && User[0].user_type == "Admin") {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.usrs = "active"
                let title = "User Management"

                let param1 = ["*"];
                let param2 = "users";
                let param3 = { "id": "!" + User[0].id };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Users = await this.DB.runSQLQuery(sql);

                let f = 0;
                Users.forEach((item) => {
                    Users[f].last_login = moment(new Date(item.last_login)).format('MMMM Do, YYYY h:mma');
                    Users[f].date_join = moment(new Date(item.date_join)).format('MMMM Do, YYYY h:mma');
                    f = f + 1;
                })


                let context = { edit: "", usrs: Users, user: User[0], sidebar: sb, title: title };
                res.render('admin/users', context);

            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    getUser = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1' && User[0].user_type == "Admin") {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.usrs = "active"
                let title = "User Management";
                let id = req.params.id;

                let param1 = ["*"];
                let param2 = "users";
                let param3 = { "id": "!" + User[0].id };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Users = await this.DB.runSQLQuery(sql);

                let f = 0;
                Users.forEach((item) => {
                    Users[f].last_login = moment(new Date(item.last_login)).format('MMMM Do, YYYY h:mma');
                    Users[f].date_join = moment(new Date(item.date_join)).format('MMMM Do, YYYY h:mma');
                    f = f + 1;
                })

                param1 = ["*"];
                param2 = "users";
                param3 = { "id": id };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var edit = await this.DB.runSQLQuery(sql);


                let context = { edit: edit[0], usrs: Users, user: User[0], sidebar: sb, title: title };
                res.render('admin/users', context);

            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    destroyItem = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "user_id": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1' && (User[0].user_type == "Admin")) {
                var data = {};
                var id = req.body.ID;
                var table = req.body.table;
                let name = req.body.name;

                if (name && id) {
                    let param1 = table;
                    let param2 = { "id": id };
                    var sql = this.DB.generateDeleteSQL(param1, param2);
                    let subj = "Updated " + name + " Profile, Profile Destroyed";
                    let det = {
                        "activity_type": table + "_update", "title": subj,
                        "category": table, "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };

                    await this.DB.runSQLQuery(sql);
                    this.HF.setActivity(det);
                    data.success = subj;
                    res.json(data)
                } else {
                    data.error = "Something Went Wrong, Please Try Again";
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
    };

    getStock = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1' && (User[0].user_type == "Admin" || User[0].user_type == "Front Desk")) {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.stock = "active"
                let title = "Restock"

                let param1 = ["*"];
                let param2 = "fish_type";
                let param3 = { "is_active": "1" };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Types = await this.DB.runSQLQuery(sql);

                param1 = ["*"];
                param2 = "products";
                param3 = { "is_active": "1" };
                let param4 = ""
                var sql = this.DB.generateSelectSQL(param1, param2, param3, param4);
                var Prods = await this.DB.runSQLQuery(sql);

                let context = { edit: "", prods: Prods, types: Types, user: User[0], sidebar: sb, title: title };
                res.render('admin/stock', context);

            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    addType = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "user_id": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1' && (User[0].user_type == "Admin" || User[0].user_type == "Front Desk")) {
                var data = {};
                var [blah, state, msg] = await this.VD.validType(req);

                if (state) {
                    var email = req.session.username;
                    let param1 = "fish_type";
                    let param2, param3;
                    if (req.files && req.files !== undefined && req.files.link && req.files.link !== undefined && req.files.link != "") {
                        param2 = { "name": req.body.name, "img": blah.db_path, "is_active": '1' };
                        param3 = param2;

                    } else {
                        param2 = { "name": req.body.name, "img": "", "is_active": '1' };
                        param3 = param2;
                    }

                    let subj = "Created New " + req.body.name + " Type Profile"
                    let det = {
                        "activity_type": "type_update", "title": subj,
                        "category": "fish_type", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };

                    var sql = this.DB.generateInsertSQL(param1, param2, param3);
                    await this.DB.runSQLQuery(sql);
                    blah.img.mv(blah.dir);
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
    };

    addProduct = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "user_id": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1' && (User[0].user_type == "Admin" || User[0].user_type == "Front Desk")) {
                var data = {};
                var [blah, state, msg] = await this.VD.validProduct(req);

                if (state) {
                    var email = req.session.username;
                    let param1 = "products";
                    let param2, param3;
                    if (req.files && req.files !== undefined && req.files.link && req.files.link !== undefined && req.files.link != "") {
                        param2 = {
                            "name": req.body.name, "img": blah.db_path,
                            "type": req.body.type, "qty": req.body.qty,
                            "qty_av": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1'
                        };
                        param3 = param2;

                    } else {
                        param2 = {
                            "name": req.body.name, "img": "",
                            "type": req.body.type, "qty": req.body.qty,
                            "qty_av": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1'
                        };
                        param3 = param2;
                    }

                    let subj = "Created New " + req.body.name + " Product Profile"
                    let det = {
                        "activity_type": "product_update", "title": subj,
                        "category": "products", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };

                    var sql = this.DB.generateInsertSQL(param1, param2, param3);
                    await this.DB.runSQLQuery(sql);
                    blah.img.mv(blah.dir);
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
    };



}

module.exports = adminControllerClass;
