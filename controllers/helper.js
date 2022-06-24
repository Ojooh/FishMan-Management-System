const DM = require('./db_controller.js');
var nodemailer = require('nodemailer');
const { encrypt, decrypt } = require('./crypto');


let helperFunctions = class {
    constructor() {
        this.DB = new DM();
        this.nameRegex = /^[A-Za-z.\s/_-]*$/;
        this.nameyRegex = /^[A-Za-z0-9.\s,/_-]*$/;
        this.emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        this.telRegex = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
        this.passRegex = /^([a-z0-9]).{6,}$/;
    }

    async createTransporter() {
        let param1 = ["email", "password"];
        let param2 = "global";
        let param3 = { "is_active": "1" };
        var sql = this.DB.generateSelectSQL(param1, param2, param3);
        var settings = await this.DB.runSQLQuery(sql);

        const email = settings[0].email;
        const password = decrypt(JSON.parse(settings[0].password));

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });

        return transporter;
    }

    async sendMail(options) {
        let trans = await this.createTransporter();

        trans.sendMail(options, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    isEmpty(input) {
        if (input == "" || input == null) {
            return true;
        } else {
            return false;
        }
    };

    validateName(name) {
        var bul = this.nameRegex.test(name);
        return bul;
    };

    validateNamey(name) {
        var bul = this.nameyRegex.test(name);
        return bul;
    };

    validateEmail(email) {
        var bul = this.emailRegex.test(email);
        return bul;
    };

    validateTel(tel) {
        var bul = this.telRegex.test(tel);
        return bul;
    };

    validatePass(password) {
        var bul = this.passRegex.test(password);
        return bul;
    };

    async emailExist(email, id = "") {
        let param1 = ["*"];
        let param2 = "users";
        let param3;
        if (id == "" || id == undefined) {
            param3 = { "email": email };
        } else {
            param3 = { "email": email + "&", "id": "!" + id };
        }
        var sql = this.DB.generateSelectSQL(param1, param2, param3);
        console.log(sql);
        var user_e = await this.DB.runSQLQuery(sql);

        if (user_e.length > 0) {
            return true
        } else {
            return false
        }

    };

    async Exist(table, column, value, id = "") {
        let param1 = ["*"];
        let param2 = table;
        let param3;
        if (id == "" || id === undefined) {
            param3 = { [column]: value };
        } else {
            param3 = { [column]: value + "&", "id": "!" + id };
        }
        var sql = this.DB.generateSelectSQL(param1, param2, param3);
        console.log(sql);
        var exist = await this.DB.runSQLQuery(sql);

        if (exist.length > 0) {
            return true
        } else {
            return false
        }

    };

    async getLastId(table) {
        let param1 = ["id"];
        let param2 = table;
        let param3 = "";
        let param4 = "ORDER BY id DESC LIMIT 1"
        var sql = this.DB.generateSelectSQL(param1, param2, param3, param4);
        var last = await this.DB.runSQLQuery(sql);

        if (last.length > 0) {
            return last[0].id
        } else {
            return 0;
        }
    }

    async getNextId(table) {
        let sql = `SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = "fishman"
                    AND TABLE_NAME = "` + table + `"`
        var last = await this.DB.runSQLQuery(sql);

        return last[0]["AUTO_INCREMENT"];
    }

    async generateUID(title, table, width) {
        var id = await this.getLastId(table);
        let n = (id + 1).toString() + '';
        n = n.toString();
        let pad_id = n.length >= width ? n : new Array(width - n.length + 1).join(0) + n;
        return title + "-" + pad_id;
    }

    generateUserType(title) {
        if (title == 'Front-Desk') {
            return "FRD";
        } else if (title == 'Vaulter') {
            return "VTR";
        } else if (title == 'Accountant') {
            return "ACC"
        } else if (title == 'Admin') {
            return 'ADM';
        } else if (title == 'Super Admin') {
            return 'ADMS';
        }
    };

    isImage(file) {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/webp") {
            return true;
        } else {
            return false;
        }
    };

    isDoc(file) {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "application/pdf" || file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            return true;
        } else {
            return false;
        }
    };

    splitArray(arr, n) {
        var run = true;
        var supreme = [];
        var count = arr.length;
        var v = 0
        var f = n

        while (run) {
            var A = [];

            for (var t = v; t < f; t++) {
                A.push(arr[t]);

            }
            if (A.length > 0) {
                supreme.push(A);
            }

            count = count - n;
            v = v + n;

            if (count > n) {
                f = f + n;
            } else {
                f = arr.length;
            }

            if (count < 0) {
                run = false;
            }

        }
        return supreme;
    };

    async setActivity(param2) {
        let param1 = "activities";
        var sql = this.DB.generateInsertSQL(param1, param2, param2);
        await this.DB.runSQLQuery(sql);
    }

    sentenceCase(str) {
        const arr = str.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

        }
        const str2 = arr.join(" ");
        return str2
    }

    validInteger(integer) {
        if (parseInt(integer) == NaN || parseInt(integer) <= 0) {
            return false;
        }
        else {
            return true
        }

    };

    validFloat(float) {
        if (parseFloat(float) == NaN || parseFloat(float) < 0) {
            return false;
        }
        else {
            return true
        }

    };




}

module.exports = helperFunctions;





// function to paginate Array
module.exports.paginateArray = (rar, n) => {
    if (rar.length > 6) {
        var thedy = this.splitArray(rar, 6);
        return [thedy[n], thedy.length];
    } else if (rar.length > 0 && rar.length < 6) {
        var supreme = [];
        supreme.push(rar);
        return [supreme, 1];
    } else {
        return [rar, -1]
    }
};


module.exports.formatDateR = (date) => {
    var d = new Date(date);
    var yy = d.getFullYear();
    var mm = (parseInt(d.getMonth()) + 1).toString();
    var dd = d.getDate();
    var HH = d.getHours();
    var MM = d.getMinutes();
    var SS = d.getSeconds();
    return yy + "/" + mm + "/" + dd + " " + HH + ":" + MM + ":" + SS;
};


module.exports.isUrlValid = (userInput) => {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
        return false;
    else
        return true;
}

module.exports.generateClassName = async (dik) => {
    let name = dik.name.toLowerCase();
    console.log(dik)

    if (!dik.ID && dik.ID === undefined) {
        return "fab fa-" + name;
    } else {
        let param1 = ["*"];
        let param2 = "social_links";
        let param3 = { "id": dik.ID };
        var sql = this.DB.generateSelectSQL(param1, param2, param3);
        console.log(sql)
        var Links = await this.DB.runSQLQuery(sql);
        let pre = Links[0].class.split("-")[0];
        console.log(pre)
        return pre + "-" + name;
    }
};


module.exports.updateProdCategoryCount = async (side, id) => {
    let param1 = ["id", "prd_count"];
    let param2 = "categories";
    let param3 = { "id": id };
    var sql = this.DB.generateSelectSQL(param1, param2, param3);
    var c = await this.DB.runSQLQuery(sql);

    if (side == "positive") {
        param2 = { "prd_count": parseInt(c[0].prd_count) + 1 };
        param1 = "categories";
        param3 = { "id": id };
        sql = this.DB.generateUpdateSQL(param1, param2, param3);
        await this.DB.runSQLQuery(sql);
    } else {
        param2 = { "prd_count": parseInt(c[0].prd_count) - 1 };
        param1 = "categories";
        param3 = { "id": id };
        sql = this.DB.generateUpdateSQL(param1, param2, param3);
        await this.DB.runSQLQuery(sql);
    }

};



