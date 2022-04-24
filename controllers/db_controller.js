const mysql = require('mysql');
require('dotenv').config()

let DatabaseManager = class {
    constructor() {
        this.dbParameters = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        };
        this.con = mysql.createConnection(this.dbParameters);
        this.con.connect(function (err) {
            if (err) throw err;
        });
    }

    generateSelectSQL(param1, param2, param3, param4 = "") {
        let what = param1.join();
        let from = param2;
        let obj = param3

        if (Object.keys(obj).length > 0) {
            let where = `(`;
            if (obj && obj != "") {
                Object.keys(obj).forEach(function (key) {
                    let j = obj[key]
                    if (j[j.length - 1] == ">") {
                        const val = j.slice(0, -1)
                        where = where + key + " > '" + val + "')";
                    }
                    else if (j[j.length - 1] == "<") {
                        const val = j.slice(0, -1)
                        where = where + key + " < '" + val + "')";
                    }
                    else if (j[j.length - 1] == `&`) {
                        const val = j.slice(0, -1)
                        where = where + key + " = '" + val + "') AND (";
                    }
                    else if (j[j.length - 1] == '/') {
                        const val = j.slice(0, -1)
                        where = where + key + " = '" + val + "') OR (";
                    }
                    else if (j[j.length - 1] == '&' && j[0] == '!') {
                        const val = j.slice(1, j.length)
                        where = where + key + " != '" + val + "') AND (";
                    }
                    else if (j[j.length - 1] == '/' && j[0] == '!') {
                        const val = j.slice(1, j.length)

                        where = where + key + " != '" + val + "') OR (";
                    }
                    else if (j[0] == '!') {

                        const val = j.slice(1, j.length)
                        where = where + key + " != '" + val + "')";
                    }
                    else {
                        where = where + key + " = '" + j + "')";
                    }
                });
            }

            if (obj && obj != "") {

                if (param4 && param4 != "") {
                    return "SELECT " + what + " FROM " + from + " WHERE " + where + " " + param4;
                }
                return "SELECT " + what + " FROM " + from + " WHERE " + where;
            }
            else {
                if (param4 && param4 != "") {
                    return "SELECT " + what + " FROM " + from + " " + param4;
                }
                return "SELECT " + what + " FROM " + from;
            }
        } else {
            if (param4 && param4 != "") {
                return "SELECT " + what + " FROM " + from + " " + param4;
            }
            return "SELECT " + what + " FROM " + from;
        }
    }

    generateUpdateSQL(param1, param2, param3) {
        let from = param1;
        let set = '';
        let obj = param2;
        let where = '(';

        Object.keys(obj).forEach(function (key) {
            let j = obj[key];
            set = set + key + ' = "' + j + '",';
        });
        set = set.slice(0, -1);

        Object.keys(param3).forEach(function (key) {
            let j = param3[key];
            if (j[j.length - 1] == '&') {
                var val = j.slice(0, -1);
                where = where + key + ' = "' + val + '") AND (';
            }
            else if (j[j.length - 1] == '/') {
                var val = j.slice(0, -1);
                where = where + key + ' = "' + val + '") OR (';
            }
            else {
                where = where + key + ' = "' + j + '")';
            }
        });

        return "UPDATE " + from + " SET " + set + " WHERE " + where;
    }

    generateInsertSQL(param1, param2, param3) {
        let from = param1;
        let col = '(';
        let obj = param2;
        let value = '(';

        Object.keys(obj).forEach(function (key) {
            col = col + "`" + key + "`,";
        });
        col = col.slice(0, -1) + ")";

        Object.keys(param3).forEach(function (key) {
            let j = param3[key];
            value = value + '"' + j + '", ';
        });

        value = value.slice(0, - 2) + ")";

        return "INSERT INTO " + from + " " + col + " VALUES " + value;
    }

    generateDeleteSQL(param1, param2) {
        let from = param1;
        let obj = param2
        let where = '(';
        if (obj && obj != "") {
            console.log(obj);
            Object.keys(obj).forEach(function (key) {
                let j = obj[key]
                console.log(j)
                if (j[j.length - 1] == '&') {
                    const val = j.slice(0, -1)
                    where = where + key + " = '" + val + "') AND (";
                }
                else if (j[j.length - 1] == '/') {
                    const val = j.slice(0, -1)
                    where = where + key + " = '" + val + "') OR (";
                }
                else if (j[j.length - 1] == '&' && j[0] == '!') {
                    const val = j.slice(1, -1)
                    where = where + key + " != '" + val + "') AND (";
                }
                else if (j[j.length - 1] == '/' && j[0] == '!') {
                    const val = j.slice(1, -1)
                    where = where + key + " != '" + val + "') OR (";
                }
                else if (j[0] == '!') {
                    const val = j.slice(1, -1)
                    where = where + key + " != '" + val + "')";
                }
                else {
                    where = where + key + " = '" + j + "')";
                }
            });
        }

        if (obj && obj != "") {

            return "DELETE FROM " + from + " WHERE " + where;
        }
    }

    runSQLQuery(sql) {
        const query = sql;
        return new Promise((resolve, reject) => {
            this.con.query(query, (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(result);
                }

            });
        });
    };


}

module.exports = DatabaseManager