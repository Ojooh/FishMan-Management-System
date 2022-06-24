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


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'dash');


            if (perm) {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.dash = "active"
                let title = "Dashboard";


                let context = { sett: Setts[0], user: User[0], sidebar: sb, title: title };
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


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'users');


            if (perm) {
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
                });

                Setts[0]["user_types"] = JSON.parse(Setts[0]["user_types"]);
                Setts[0]["modules"] = JSON.parse(Setts[0]["modules"]);


                let context = { edit: "", sett: Setts[0], usrs: Users, user: User[0], sidebar: sb, title: title };
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


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'users');


            if (perm) {
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


                let context = { edit: edit[0], sett: Setts[0], usrs: Users, user: User[0], sidebar: sb, title: title };
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


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'stock');


            if (perm) {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.stock = "active"
                let title = "Restock"

                let param1 = ["*"];
                let param2 = "fish_type";
                let param3 = { "is_active": "1" };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Types = await this.DB.runSQLQuery(sql);

                sql = `SELECT products.id, products.name, products.img, products.type, 
                            fish_type.name As type_name, products.qty, products.pieces, products.qty_av, products.size, 
                            products.bought, products.sell, products.is_active, products.date_created 
                            FROM products INNER JOIN fish_type on products.type 
                            WHERE products.type = fish_type.id`
                var Prods = await this.DB.runSQLQuery(sql);

                // Setts[0]["perm"] = JSON.parse(Setts[0]["perm"]);

                let context = { edit: "", prods: Prods, types: Types, sett: Setts[0], user: User[0], sidebar: sb, title: title };
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
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'stock');


            if (perm) {
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
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'stock');


            if (perm) {
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
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'stock');


            if (perm) {
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
                            "type": req.body.type, "qty": req.body.qty, "pieces": req.body.pieces,
                            "qty_av": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1'
                        };
                        blah.img.mv(blah.dir);

                    } else {
                        param2 = {
                            "name": req.body.name, "img": "",
                            "type": req.body.type, "qty": req.body.qty, "pieces": req.body.pieces,
                            "qty_av": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1'
                        };
                    }
                    param2_2 = {
                        "qty": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                        "sell": req.body.sprice, "product": blah.prod_id, "pieces": req.body.pieces,
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
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'stock');


            if (perm) {
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
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'stock');


            if (perm) {
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
                            "type": req.body.type, "qty": req.body.qty, "pieces": req.body.pieces,
                            "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1', "qty_av": ((Prev[0].qty < req.body.qty) ? Prev[0].qty_av : req.body.qty),
                        };
                        blah.img.mv(blah.dir);
                    } else {
                        param2 = {
                            "name": req.body.name, "img": Prev[0].img,
                            "type": req.body.type, "qty": req.body.qty, "pieces": req.body.pieces,
                            "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "is_active": '1', "qty_av": ((Prev[0].qty < req.body.qty) ? Prev[0].qty_av : req.body.qty),
                        };
                    }

                    if (Prev[0].qty != req.body.qty || Prev[0].size != req.body.size || Prev[0].bought != req.body.bprice || Prev[0].sell != req.body.sprice) {
                        param2_2 = {
                            "qty": req.body.qty, "size": req.body.size, "bought": req.body.bprice,
                            "sell": req.body.sprice, "product": req.body.ID, "pieces": req.body.pieces,
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

    getVault = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'vault');


            if (perm) {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.vault = "active"
                let title = "Vault"

                param1 = ["id", "name"];
                param2 = "fish_type";
                param3 = { "is_active": "1" };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Types = await this.DB.runSQLQuery(sql);

                let context = { types: Types, sett: Setts[0], user: User[0], sidebar: sb, title: title };
                res.render('admin/vault', context);

            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    addVaultRecord = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'vault');


            if (perm) {
                var data = {};
                let param4, param5;
                var [blah, state, msg] = await this.VD.validVaultRecord(req);

                if (state) {
                    var email = req.session.username;
                    param1 = "vault_records";
                    param2 = {
                        "prod_type": req.body.prod_type, "prod": req.body.prod, "vlt_type": req.body.vlt_type,
                        "qty": req.body.qty, "size": req.body.size, "price": req.body.price, "remark": req.body.remark, "done_by": User[0].user_id
                    };

                    param3 = "products"
                    param4 = { "qty_av": blah.qty_av };
                    param5 = { "id": req.body.prod };


                    let subj = "Created New Vault Record"
                    let det = {
                        "activity_type": "vault_add", "title": subj,
                        "category": "fish_type", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };

                    var sql = this.DB.generateInsertSQL(param1, param2, param2);
                    await this.DB.runSQLQuery(sql);
                    var sql = this.DB.generateUpdateSQL(param3, param4, param5);
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

    getProdByType = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'vault');


            if (perm) {
                var data = {};
                param1 = ["id", "name", "sell"];
                param2 = "products";
                param3 = { "type": req.body.ID + "&", "qty_av": "0>" };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                console.log(sql);
                var Log = await this.DB.runSQLQuery(sql);

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

    getPOS = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'pos');


            if (perm) {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.pos = "active"
                let title = "Point of Sale"

                param1 = ["*"];
                param2 = "fish_type";
                param3 = { "is_active": "1" };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Types = await this.DB.runSQLQuery(sql);

                param2 = "products";
                param3 = { "is_active": "1" };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Prods = await this.DB.runSQLQuery(sql);

                let context = { prods: Prods, types: Types, sett: Setts[0], user: User[0], sidebar: sb, title: title };
                res.render('admin/pos', context);

            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    getReceipt = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'pos');


            if (perm) {
                let no = req.params.no
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.pos = "active"
                let title = "Point of Sale"

                param1 = ["*"];
                param2 = "sales";
                param3 = { "receipt_no": no };
                var sql = this.DB.generateSelectSQL(param1, param2, param3);
                var Sales = await this.DB.runSQLQuery(sql);

                let f = 0;
                Sales.forEach((item) => {
                    Sales[f].date_created = moment(new Date(item.date_created)).format('MMMM Do, YYYY h:mma');
                    f = f + 1;
                });

                let context = { sales: Sales[0], sett: Setts[0], user: User[0], sidebar: sb, title: title };
                res.render('admin/receipt', context);

            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    searchProdByType = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'pos');


            if (perm) {
                var data = {};

                let srch = req.body.srch;
                let ID = req.body.ID;
                console.log(ID);
                let sql;
                if (ID && ID != "" && ID !== undefined) {
                    sql = `SELECT * FROM products WHERE (type = '` + ID + `') AND (name LIKE '%` + srch + `%' 
                            OR sell LIKE '%`  + srch + `%');`;
                } else {
                    sql = `SELECT * FROM products WHERE (name LIKE '%` + srch + `%' OR sell LIKE '%` + srch + `%');`;
                }

                console.log(sql)
                var Log = await this.DB.runSQLQuery(sql);

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

    checkPrdAvl = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'pos');


            if (perm) {
                var data = {};
                let qty = req.body.qty;
                let ID = req.body.ID;
                let typ = req.body.typ;
                let sql;
                if (ID && ID != "" && ID !== undefined) {
                    param1 = ["*"];
                    param2 = "vault_records";
                    param3 = { "is_active": "1&", "prod": ID + "&", "vlt_type": typ };
                    let param4 = `ORDER BY date_created DESC LIMIT 1`;
                    sql = this.DB.generateSelectSQL(param1, param2, param3, param4);
                    console.log(sql);
                    var Record = await this.DB.runSQLQuery(sql);

                    if (Record && Record.length > 0 && Record[0].qty >= qty) {
                        data.success = "Fetched all " + Record.length.toString() + " Records";
                        data.vlt_id = Record[0].id
                        data.avl = true;
                    } else {
                        data.success = "Fetched all " + Record.length.toString() + " Records quantity is not available";
                        data.avl = false;
                    }
                } else {
                    data.error = "Could not find any product record in vault";
                    data.avl = false;
                }
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

    getSettings = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'settings');


            if (perm) {
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.sett = "active"
                let title = "Settings"

                Setts[0]["user_types"] = JSON.parse(Setts[0]["user_types"]);
                Setts[0]["modules"] = JSON.parse(Setts[0]["modules"]);


                let context = { sett: Setts[0], user: User[0], sidebar: sb, title: title };
                res.render('admin/settings', context);

            }
            else {
                res.redirect("/auth/login");
            }
        }
        else {
            res.redirect("/auth/login");
        }
    };

    updateSettings = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'settings');


            if (perm) {
                var data = {};
                var [blah, state, msg] = await this.VD.validSettings(req);

                if (state) {
                    if (req.files && req.files !== undefined && req.files.link && Setts[0].img && Setts[0].img != "") {
                        let url = path.join(__dirname, '../', 'public') + Setts[0].img;
                        console.log(url);
                        fs.unlink(url, function (err) {
                            if (err) throw err;
                            console.log('File deleted!');
                        });
                    }
                    param1 = "settings";
                    param3 = { "id": Setts[0].id }
                    if (req.files && req.files !== undefined && req.files.link && req.files.link !== undefined && req.files.link != "") {
                        param2 = blah.query;
                        blah.img.mv(blah.dir);
                    } else {
                        param2 = blah.query;

                    }


                    let subj = "Update Settings";
                    let det = {
                        "activity_type": "settings_update", "title": subj,
                        "category": "products", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                    };
                    param2["created_by"] = User[0].user_id + "_" + User[0].fname + User[0].lname

                    var sql = this.DB.generateUpdateSQL(param1, param2, param3);
                    console.log(sql)
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

    addSalesRecord = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'pos');


            if (perm) {
                var data = {};
                var email = req.session.username;
                const body = req.body;
                console.log(JSON.stringify(body.order));
                param1 = "sales";
                param2 = {
                    "receipt_no": await this.HF.generateUID("RCP", "sales", "4"),
                    "items~": JSON.stringify(body.order), "total": body.total, "subtotal": body.subTotal,
                    "tax": body.tax, "discount": body.discount, "amt_rcvd": body.given,
                    "trans_change": body.change, "remark": body.remark, "state": body.state,
                    "trans_by": User[0].user_id, "payment_type": body.payment_type
                };


                let subj = "Created New Sales Record"
                let det = {
                    "activity_type": "sales_add", "title": subj,
                    "category": "pos", "activity_by": User[0].user_id + "_" + User[0].fname + User[0].lname
                };

                var sql = this.DB.generateInsertSQL(param1, param2, param2);
                console.log(sql);
                await this.DB.runSQLQuery(sql);

                const vl = this.DB

                JSON.parse(body.det).forEach(async function (item) {
                    console.log(item);
                    var sql = vl.generateSelectSQL(['*'], 'vault_records', { 'id': item.vlt_id });
                    var Vault = await vl.runSQLQuery(sql);
                    var new_qty = (parseInt(Vault[0].qty) - parseInt(item.qty));
                    var new_size = (parseInt(Vault[0].size) - parseInt(item.size));
                    let update
                    if (new_qty < 0) {
                        new_qty = 0
                        update = { is_active: "0", 'qty': new_qty, 'size': new_size };
                    } else {
                        update = { 'qty': new_qty, 'size': new_size };
                    }

                    var sql = vl.generateUpdateSQL('vault_records', update, { 'id': Vault[0].id });
                    await vl.runSQLQuery(sql);

                });


                this.HF.setActivity(det);

                data.success = "Transaction Recorded Successfully";
                data.receipt_no = param2["receipt_no"];
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

    getFinance = async (req, res) => {
        if (req.session.username && req.session.loggedin) {
            var email = req.session.username;
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "email": email + "/", "username": email };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var User = await this.DB.runSQLQuery(sql);


            param1 = ["*"];
            param2 = "settings";
            param3 = { "is_active": "1" };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Setts = await this.DB.runSQLQuery(sql);

            let perm = await this.VD.validPermission(User, Setts, 'finances');


            if (perm) {
                let date = req.params.date;
                let range = (req.params.range && req.params.range != '' ? req.params.range.split(",") : undefined);
                let sql, sql2, sql3, from_date, to_date;
                console.log(date);
                let sb = { dash: "", vault: "", pos: "", fin: "", stock: "", usrs: "" };
                sb.fin = "active"
                let title = "Finances";
                let cart_vlt_total_sql = `SELECT SUM(QTY) AS qty_total, COUNT(*) AS count FROM vault_records WHERE is_active = 1 AND vlt_type = "Carton"`
                let cart_vlt_sql = `SELECT vault_records.prod, vault_records.vlt_type, vault_records.qty, products.name FROM vault_records  INNER JOIN products ON vault_records.prod = products.id WHERE vault_records.is_active = 1 AND vault_records.vlt_type = "Carton"`
                let singl_vlt_total_sql = `SELECT SUM(QTY) AS qty_total, COUNT(*) AS count FROM vault_records WHERE is_active = 1 AND vlt_type = "Single"`;
                let singl_vlt_sql = `SELECT vault_records.prod, vault_records.vlt_type, vault_records.qty, products.name FROM vault_records  INNER JOIN products ON vault_records.prod = products.id WHERE vault_records.is_active = 1 AND vault_records.vlt_type = "Single"`;
                let stock = `SELECT * FROM products WHERE is_active = 1`;

                if (date == 'today') {
                    sql = `SELECT COUNT(*) AS count, SUM(subtotal) AS total FROM sales WHERE date_created BETWEEN DATE_SUB(NOW(),INTERVAL 1 DAY) AND NOW()`;
                }
                else if (date == 'week') {
                    sql = `SELECT COUNT(*) AS count, SUM(subtotal) AS total FROM sales WHERE date_created BETWEEN DATE_SUB(NOW(),INTERVAL 1 WEEK) AND NOW()`;
                }
                else if (date == 'month') {
                    sql = `SELECT COUNT(*) AS count, SUM(subtotal) AS total FROM sales WHERE date_created BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()`;
                }
                else if (date == 'year') {
                    sql = `SELECT COUNT(*) AS count, SUM(subtotal) AS total FROM sales WHERE date_created BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
                }

                if (range && range.length > 1) {
                    sql2 = `SELECT * FROM sales WHERE date_created BETWEEN '` + range[0] + ` 00:00:00 ' AND '` + range[1] + ` 23:59:00';`;
                    sql3 = `SELECT SUM(subtotal) AS total FROM sales WHERE date_created BETWEEN '` + range[0] + ` 00:00:00 ' AND '` + range[1] + ` 23:59:00';`;
                    from_date = moment(new Date(range[0])).format('MMMM Do, YYYY h:mma');
                    to_date = moment(new Date(range[1])).format('MMMM Do, YYYY h:mma');
                } else {
                    sql2 = `SELECT * FROM sales WHERE date_created BETWEEN DATE_SUB(NOW(),INTERVAL 1 DAY) AND NOW()`;
                    sql3 = `SELECT SUM(subtotal) AS total FROM sales WHERE date_created BETWEEN DATE_SUB(NOW(),INTERVAL 1 DAY) AND NOW()`;
                    from_date = moment(new Date()).format('MMMM Do, YYYY h:mma');
                    to_date = moment(new Date()).format('MMMM Do, YYYY h:mma');
                }

                console.log(sql2);


                var Report = await this.DB.runSQLQuery(sql);
                var Sales = await this.DB.runSQLQuery(sql2);
                var Total = await this.DB.runSQLQuery(sql3);
                var CartT = await this.DB.runSQLQuery(cart_vlt_total_sql);
                var Cart = await this.DB.runSQLQuery(cart_vlt_sql);
                var SinglT = await this.DB.runSQLQuery(singl_vlt_total_sql);
                var Singl = await this.DB.runSQLQuery(singl_vlt_sql);
                var Stock = await this.DB.runSQLQuery(stock);
                var crt = 0;
                var sgl = 0;

                let f = 0;
                Sales.forEach((item) => {
                    Sales[f].date_created = moment(new Date(item.date_created)).format('MMMM Do, YYYY h:mma');
                    f = f + 1;
                });



                if (Stock && Stock.length > 0) {
                    Stock.forEach(function (item) {
                        if (item.qty_av && item.qty_av != 0) {
                            var s = item.qty_av.split(";");
                            crt += parseInt(s[0]);
                            sgl += ((s && s.length > 1) ? parseInt(s[1]) : 0);
                        } else {
                            crt += parseInt(item.qty);
                        }
                    })
                }


                let context = {
                    total: Total[0], sales: Sales, stock: Stock, crt: crt, sgl: sgl, cart_total: CartT[0], carts: Cart,
                    single_total: SinglT[0], single: Singl,
                    report: Report[0], sett: Setts[0], user: User[0],
                    sidebar: sb, title: title, param: 'today', from_date, to_date
                };
                res.render('admin/finances', context);

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
