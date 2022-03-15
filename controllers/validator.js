
const HF = require('./helper');
const DM = require('./db_controller');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


let validationClass = class {
    constructor() {
        this.HF = new HF();
        this.DB = new DM();
    }

    async validUser(req) {
        let exist = await this.HF.emailExist(req.body.email, req.body.ID);
        if (req.body.ID && req.body.ID != "") {
            let param1 = ["*"];
            let param2 = "users";
            let param3 = { "id": req.body.ID };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var user = await this.DB.runSQLQuery(sql);
        }

        if (this.HF.isEmpty(req.body.fname) || this.HF.validateName(req.body.fname) == false) {
            return [null, false, { message: 'Fisrt Name Input is not valid' }];
        }
        else if (this.HF.isEmpty(req.body.lname) || this.HF.validateName(req.body.lname) == false) {
            return [null, false, { message: 'Last Name Input is not valid' }];
        }
        else if (this.HF.isEmpty(req.body.email) || this.HF.validateEmail(req.body.email) == false) {
            return [null, false, { message: 'Email Input is not valid' }];
        }
        else if (exist) {
            return [null, false, { message: 'Email Input is not valid, already exist in database' }];
        }
        else if (!this.HF.isEmpty(req.body.phone) && this.HF.validateTel(req.body.phone) == false) {
            swalShowError("Phone Number Input is not valid", errorClass);
        }
        else if (this.HF.isEmpty(req.body.gender)) {
            return [null, false, { message: 'Gender input not valid' }];
        }
        else if (this.HF.isEmpty(req.body.user_type)) {
            return [null, false, { message: 'User Type input not valid' }];
        }
        else {
            let uid, passhash = "";
            req.body.fname = this.HF.sentenceCase(req.body.fname);
            req.body.lname = this.HF.sentenceCase(req.body.lname);

            let msg = req.body.fname + ' User Profile Created successfully'
            if (req.body.type != "add") {
                msg = req.body.fname + ' User Profile Updated successfully'
                if (req.body.password == "") {
                    passhash = user[0].password;
                } else {
                    passhash = await new Promise((resolve, reject) => {
                        bcrypt.hash(req.body.password, 10, function (err, hash) {
                            if (err) reject(err)
                            resolve(hash)
                        });
                    });
                }
            } else {
                uid = uuidv4();
                let link = req.get('host') + "/verify/" + uid;
                let options = {
                    from: "noreply@nimicuisine.com",
                    to: req.body.email,
                    subject: "Activate your Admin Account",
                    html: `<p>You have been registered as an admin for Nimi's cuisine.</p>
                    <br> <br>
                    <p>To activate your account follow this link: <a href="` + link + `">` + link + `</a>
                    and set a Password for your account ` + req.body.email + `</p><br><br>

                    Thank You and Kind regards!<br>
                    From Admin Team Nimi Cuisine`
                }
                // await this.HF.sendMail(options);
                passhash = await new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        if (err) reject(err)
                        resolve(hash)
                    });
                });
            }




            console.log(passhash);

            let title = this.HF.generateUserType(req.body.user_type);
            let extra = {
                id: await this.HF.generateUID(title, "users", 4), uid: uid, hash: passhash
            }
            return [extra, true, { message: msg }];
        }
    };

    async validType(req) {
        let exist = await this.HF.Exist("fish_type", "name", req.body.name, req.body.ID);


        if (!req.files || this.HF.isImage(req.files.link) == false) {
            return [null, false, { message: 'Type Image Input is not valid, must be an image file' }];
        }
        else if (this.HF.isEmpty(req.body.name) || this.HF.validateName(req.body.name) == false) {
            return [null, false, { message: 'Type Name Input is not valid' }];
        }
        else if (exist) {
            return [null, false, { message: 'Type Name Input already exist in Database' }];
        }
        else {
            req.body.name = this.HF.sentenceCase(req.body.name);
            let img = req.files.link;
            let ext = img.name.split(".");
            let new_name = uuidv4() + "." + ext[ext.length - 1];
            let dir = "public/img/types/" + new_name;
            let db_path = "/img/types/" + new_name;

            let msg = req.body.name + ' Type Profile Created successfully'
            if (req.body.type != "add") {
                msg = req.body.name + ' Type Profile Updated successfully'
            }

            let extra = {
                img: img, db_path: db_path, dir: dir
            }
            return [extra, true, { message: msg }];
        }
    };

    async validProduct(req) {
        let exist = await this.HF.Exist("products", "name", req.body.name, req.body.ID);

        if (!req.body.type || this.HF.isEmpty(req.body.type) || req.body.type == "undefined") {
            return [null, false, { message: 'No product Type was selected please go back and select a product' }];
        }
        else if (!req.files || this.HF.isImage(req.files.link) == false) {
            return [null, false, { message: 'Product Image Input is not valid, must be an image file' }];
        }
        else if (this.HF.isEmpty(req.body.name) || this.HF.validateName(req.body.name) == false) {
            return [null, false, { message: 'Prodict Name Input is not valid' }];
        }
        else if (exist) {
            return [null, false, { message: 'Product Name Input already exist in Database' }];
        }
        else if (this.HF.isEmpty(req.body.qty) || this.HF.validInteger(req.body.qty) == false) {
            return [null, false, {
                message: 'Quantity Input is not Valid'
            }];
        }
        else if (this.HF.isEmpty(req.body.size) || this.HF.validFloat(req.body.size) == false) {
            return [null, false, {
                message: 'Size Input is not Valid'
            }]
        }
        else if (this.HF.isEmpty(req.body.bprice) || this.HF.validFloat(req.body.bprice) == false) {
            return [null, false, {
                message: 'Buy Price Input is not Valid'
            }]
        }
        else if (this.HF.isEmpty(req.body.sprice) || this.HF.validFloat(req.body.sprice) == false || parseFloat(req.body.sprice) < parseFloat(req.body.bprice)) {
            return [null, false, {
                message: 'Sell Price Input is not Valid, must be greater than buy price'
            }]
        }
        else {
            req.body.name = this.HF.sentenceCase(req.body.name);
            let img = req.files.link;
            let ext = img.name.split(".");
            let new_name = uuidv4() + "." + ext[ext.length - 1];
            let dir = "public/img/products/" + new_name;
            let db_path = "/img/products/" + new_name;

            let msg = req.body.name + ' Product Profile Created successfully'
            if (req.body.type != "add") {
                msg = req.body.name + ' Product Profile Updated successfully'
            }

            let extra = {
                img: img, db_path: db_path, dir: dir
            }
            return [extra, true, { message: msg }];
        }
    };
}

module.exports = validationClass;