const DM = require('./db_controller');
const HF = require('./helper');
const VD = require('./validator');
const moment = require('moment');
var express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');


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

    toggleItemState = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "user_id": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1') {
                var data = {};
                var id = req.body.ID;
                var table = req.body.table;
                let name = req.body.name;
                let state = req.body.state;
                let subj

                if (name && id) {
                    let param1 = table;
                    let param2 = { "is_active": state };
                    let param3 = { "id": id }
                    var sql = this.DB.generateUpdateSQL(param1, param2, param3);
                    if (state == "1") {
                        subj = "Updated " + name + " Profile, Profile Activated";
                    } else {
                        subj = "Updated " + name + " Profile, Profile De-activated";
                    }
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

                sql = `SELECT products.id, products.name, products.img, products.type, 
                            fish_type.name As type_name, products.qty, products.qty_av, products.size, 
                            products.bought, products.sell, products.is_active, products.date_created 
                            FROM products INNER JOIN fish_type on products.type 
                            WHERE products.type = fish_type.id`
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
                        blah.img.mv(blah.dir);

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

    editType = async (req, res) => {
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
                let param1 = ["*"];
                let param2 = "fish_type";
                let param3 = { "id": req.body.ID };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Prev = await this.DB.runSQLQuery(sql);

                if (state) {
                    if (req.files && req.files !== undefined && req.files.link && Prev[0].img && Prev[0].img != "") {
                        let url = path.join(__dirname, '../', 'public') + Prev[0].img;
                        console.log(url);
                        fs.unlink(url, function (err) {
                            if (err) throw err;
                            console.log('File deleted!');
                        });
                    }
                    let param1 = "fish_type";
                    let param3 = { "id": req.body.ID }
                    let param2;
                    if (req.files && req.files !== undefined && req.files.link && req.files.link !== undefined && req.files.link != "") {
                        param2 = { "name": req.body.name, "img": blah.db_path, "is_active": '1' };
                        blah.img.mv(blah.dir);

                    } else {
                        param2 = { "name": req.body.name, "img": Prev[0].img, "is_active": '1' };
                    }

                    let subj = "Updated New " + req.body.name + " Type Profile"
                    let det = {
                        "activity_type": "type_update", "title": subj,
                        "category": "fish_type", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };

                    var sql = this.DB.generateUpdateSQL(param1, param2, param3);
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
                    let param1_1 = "products_log"
                    let param2, param2_2;
                    if (req.files && req.files !== undefined && req.files.link && req.files.link !== undefined && req.files.link != "") {
                        param2 = {
                            "name": req.body.name, "img": blah.db_path,
                            "type": req.body.type, "qty": req.body.qty,
                            "qty_av": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1'
                        };
                        blah.img.mv(blah.dir);

                    } else {
                        param2 = {
                            "name": req.body.name, "img": "",
                            "type": req.body.type, "qty": req.body.qty,
                            "qty_av": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1'
                        };
                    }
                    param2_2 = {
                        "qty": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                        "sell": req.body.sprice, "product": blah.prod_id
                    }

                    let subj = "Created New " + req.body.name + " Product Profile"
                    let det = {
                        "activity_type": "product_update", "title": subj,
                        "category": "products", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };

                    var sql = this.DB.generateInsertSQL(param1, param2, param2);
                    await this.DB.runSQLQuery(sql);
                    var sql = this.DB.generateInsertSQL(param1_1, param2_2, param2_2);
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
    };

    getProdLog = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "user_id": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);

            if (User && User.length > 0 && User[0].is_active == '1' && (User[0].user_type == "Admin" || User[0].user_type == "Front Desk")) {
                var data = {};
                let param1 = ["*"];
                let param2 = "products_log";
                let param3 = { "product": req.body.ID };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Log = await this.DB.runSQLQuery(sql);

                let f = 0;
                Log.forEach((item) => {
                    Log[f].date_created = moment(new Date(item.date_created)).format('MM/DD/YYYY h:mma');
                    f = f + 1;
                })

                data.success = "Fetched all " + Log.length.toString() + " Records";
                data.data = Log
                res.json(data)
            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    editProduct = async (req, res) => {
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
                let param1 = ["*"];
                let param2 = "products";
                let param3 = { "id": req.body.ID };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Prev = await this.DB.runSQLQuery(sql);

                if (state) {
                    if (req.files && req.files !== undefined && req.files.link && Prev[0].img && Prev[0].img != "") {
                        let url = path.join(__dirname, '../', 'public') + Prev[0].img;
                        console.log(url);
                        fs.unlink(url, function (err) {
                            if (err) throw err;
                            console.log('File deleted!');
                        });
                    }
                    let param1 = "products";
                    let param1_1 = "products_log"
                    let param3 = { "id": req.body.ID }
                    let param2, param2_2;
                    if (req.files && req.files !== undefined && req.files.link && req.files.link !== undefined && req.files.link != "") {
                        param2 = {
                            "name": req.body.name, "img": blah.db_path,
                            "type": req.body.type, "qty": req.body.qty,
                            "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1'
                        };
                        blah.img.mv(blah.dir);
                    } else {
                        param2 = {
                            "name": req.body.name, "img": Prev[0].img,
                            "type": req.body.type, "qty": req.body.qty,
                            "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1'
                        };
                    }

                    if (Prev[0].qty != req.body.qty || Prev[0].size != req.body.size || Prev[0].bought != req.body.bprice || Prev[0].sell != req.body.sprice) {
                        param2_2 = {
                            "qty": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "product": req.body.ID
                        }
                        var sql = this.DB.generateInsertSQL(param1_1, param2_2, param2_2);
                        await this.DB.runSQLQuery(sql);
                    }

                    let subj = "Updated New " + req.body.name + " Product Profile"
                    let det = {
                        "activity_type": "type_update", "title": subj,
                        "category": "products", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };

                    var sql = this.DB.generateUpdateSQL(param1, param2, param3);
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
    };



}

module.exports = adminControllerClass;