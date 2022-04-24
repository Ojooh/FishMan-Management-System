
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


        if (req.files && this.HF.isImage(req.files.link) == false) {
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
            let img, dir, db_path = "";
            if (req.files) {
                img = req.files.link;
                let ext = img.name.split(".");
                let new_name = uuidv4() + "." + ext[ext.length - 1];
                dir = "public/img/types/" + new_name;
                db_path = "/img/types/" + new_name;
            }


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
        else if (req.files && this.HF.isImage(req.files.link) == false) {
            return [null, false, { message: 'Product Image Input is not valid, must be an image file' }];
        }
        else if (this.HF.isEmpty(req.body.name) || this.HF.validateName(req.body.name) == false) {
            return [null, false, { message: 'Prodict Name Input is not valid' }];
        }
        else if (exist) {
            return [null, false, { message: 'Product Name Input already exist in Database' }];
        }
        else if (this.HF.isEmpty(req.body.qty) || this.HF.validFloat(req.body.qty) == false) {
            return [null, false, {
                message: 'Quantity Input is not Valid'
            }];
        }
        else if (this.HF.isEmpty(req.body.pieces) || this.HF.validInteger(req.body.pieces) == false) {
            return [null, false, {
                message: 'Pieces Input is not Valid'
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
            let img, dir, db_path = "";
            if (req.files) {
                img = req.files.link;
                let ext = img.name.split(".");
                let new_name = uuidv4() + "." + ext[ext.length - 1];
                dir = "public/img/products/" + new_name;
                db_path = "/img/products/" + new_name;
            }

            let msg = req.body.name + ' Product Profile Created successfully'
            let id = await this.HF.getNextId("products");
            if (req.body.type != "add") {
                msg = req.body.name + ' Product Profile Updated successfully'
            }

            let extra = {
                img: img, db_path: db_path, dir: dir, prod_id: id
            }
            return [extra, true, { message: msg }];
        }
    };

    async validVaultRecord(req) {

        if (!req.body.prod_type || this.HF.isEmpty(req.body.prod_type) || req.body.prod_type == "undefined") {
            return [null, false, { message: 'No product Type was selected please go back and select a product type' }];
        }
        if (!req.body.prod || this.HF.isEmpty(req.body.prod) || req.body.prod == "undefined") {
            return [null, false, { message: 'No product was selected please go back and select a product' }];
        }
        if (!req.body.vlt_type || this.HF.isEmpty(req.body.vlt_type) || req.body.vlt_type == "undefined") {
            return [null, false, { message: 'No Vault Type was selected please go back and select a vault type' }];
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
        else if (this.HF.isEmpty(req.body.price) || this.HF.validFloat(req.body.price) == false) {
            return [null, false, {
                message: 'Price Input is not Valid'
            }]
        }

        else {
            let msg = 'Vault Record Created successfully'

            let param1 = ["qty_av", "pieces"];
            let param2 = "products";
            let param3 = { "id": req.body.prod };
            var sql = this.DB.generateSelectSQL(param1, param2, param3);
            var Prod = await this.DB.runSQLQuery(sql);
            var qty_av = Prod[0].qty_av.split(";");
            var piec = Prod[0].pieces;
            var carton = parseInt(qty_av[0]);
            var pieces = ((qty_av[1]) ? parseInt(qty_av[1]) : 0);
            let qty = parseInt(req.body.qty);

            if (req.body.vlt_type == "Single") {
                let total = ((carton * piec) + pieces)
                if (qty > total) {
                    return [null, false, {
                        message: 'Quantity is more than what is available'
                    }];

                }
                total = total - qty;
                total = (total / piec).toString().split(".");
                var carton = total[0]
                var pieces = parseFloat("0." + total[1]) * piec;
                qty_av = carton.toString() + ";" + pieces.toString();
            } else {
                if (qty > carton) {
                    return [null, false, {
                        message: 'Quantity is more than what is available'
                    }];
                }
                carton = carton - qty;
                qty_av = carton.toString() + ";" + pieces.toString()
            }

            return [{ qty_av: qty_av }, true, { message: msg }];
        }
    };
}

module.exports = validationClass;