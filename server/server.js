const sqlite3 = require('sqlite3');
const express = require("express");

var app = express();

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

app.use(express.json());

// INIT DB (MEMORY)
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        db.run(`CREATE TABLE partners( \
            partner_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            name NVARCHAR(20) NOT NULL,\
            company_form_id INTEGER NOT NULL,\
            tax_number NVARCHAR(20) NOT NULL,\
            company_number NVARCHAR(100) NOT NULL,\
            city INTEGER NOT NULL,\
            address NVARCHAR(100) NOT NULL,\
            phone NVARCHAR(100) NOT NULL,\
            bank_account NVARCHAR(100) NOT NULL,\
            comment NVARCHAR(100) NOT NULL\            
        )`, (err) => {
            if (err) {
                console.log("Table already exists.");
                return
            }
            let insert = `INSERT INTO partners \
                          (name, company_form_id, tax_number, company_number, city, address, phone, bank_account, comment) \
                          VALUES (?,?,?,?,?,?,?,?,?)`;

            db.run(insert, ["Berenyi", 1, "123456789", "ABC123456", 1, "Best street 22", "+36251234567", "123456-789456-123456", "This is a comment"]);
            db.run(insert, ["Valamilyen", 2, "100000000", "CD123456", 1, "Free road 4", "+12457955", "55555-1444-8888", "This is a comment"]);
        });

        db.run(`CREATE TABLE company_form( \
            company_form_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            company_form_name NVARCHAR(20) NOT NULL\                        
        )`, (err) => {
            if (err) {
                console.log("Table already exists.");
                return
            }
            let insert = 'INSERT INTO company_form (company_form_name) VALUES (?)';
            db.run(insert, ["Kft"]);
            db.run(insert, ["Bt"]);
            db.run(insert, ["Rt"]);
        });

        db.run(`CREATE TABLE cities( \
            city_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            city_name NVARCHAR(20) NOT NULL\                        
        )`, (err) => {
            if (err) {
                console.log("Table already exists.");
                return

            }
            let insert = 'INSERT INTO cities (city_name) VALUES (?)';
            db.run(insert, ["Budapest"]);
            db.run(insert, ["Debrecen"]);
            db.run(insert, ["Pecs"]);
            db.run(insert, ["Miskolc"]);
            db.run(insert, ["Siofok"]);
            db.run(insert, ["Szeged"]);
        });
    }
});

// GET ONE PARTNER
app.get("/partners/:id", (req, res, next) => {
    var params = [req.params.id]
    db.get("SELECT * FROM partners where partner_id = ?", [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json(row);
    });
});

// GET ALL PARTNER
app.get("/partners", (req, res, next) => {
    db.all(`SELECT p.name, p.tax_number, p.company_number, \
                p.address, p.phone, p.bank_account, p.comment, \
                c.city_name, cf.company_form_name FROM partners p \
                JOIN cities c ON p.city = c.city_id \
                JOIN company_form cf ON p.company_form_id = cf.company_form_id `, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json({rows});
    });
});

// ADD NEW PARTNER
app.post("/partners", function (req, res) {
    console.log(req.body)
    let reqBody = req.body;
    db.run(`INSERT INTO partners \
                (name, company_form_id, tax_number, company_number, city, address, phone, bank_account, comment) \
                VALUES (?,?,?,?,?,?,?,?,?)`,
        [reqBody.name, reqBody.company_form_id, reqBody.tax_number, reqBody.company_number,
            reqBody.city, reqBody.address, reqBody.phone, reqBody.bank_account, reqBody.comment],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }
            res.status(201).json({
                "partner_id": this.lastID
            })
        });
});

// UPDATE PARTNER
app.patch("/partners/", (req, res, next) => {
    var reqBody = req.body;
    db.run(`UPDATE partners set name = ?, company_form_id = ?, tax_number = ?, \
     company_number = ?, city = ?, address = ?, phone = ?, bank_account = ?, comment = ? WHERE partner_id = ?`,
        [reqBody.name, reqBody.company_form_id, reqBody.tax_number, reqBody.company_number, reqBody.city,
            reqBody.address, reqBody.phone, reqBody.bank_account, reqBody.comment, reqBody.partner_id],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message})
                return;
            }
            res.status(200).json({updatedID: this.changes});
        });
});

// DELETE PARTNER
app.delete("/partners/:id", (req, res, next) => {
    db.run(`DELETE FROM partners WHERE partner_id = ?`,
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message})
                return;
            }
            res.status(200).json({deletedID: this.changes})
        });
});

// GET ALL CITIES
app.get("/cities", (req, res, next) => {
    db.all(`SELECT * FROM cities `, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json({rows});
    });
});

// GET A CITY
app.get("/cities/:id", (req, res, next) => {
    db.all(`SELECT * FROM cities WHERE city_id = ?`, [req.params.id,], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json({rows});
    });
});

// ADD NEW CITY
app.post("/cities", function (req, res) {
    let reqBody = req.body;
    db.run(`INSERT INTO cities \
                (city_name) \
                VALUES (?)`,
        [reqBody.city_name],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }
            res.status(201).json({
                "city_id": this.lastID
            })
        });
});

// GET ALL COMPANY_FORM
app.get("/company-form", (req, res, next) => {
    db.all(`SELECT * FROM company_form `, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json({rows});
    });
});

// GET A COMPANY FORM
app.get("/company-form/:id", (req, res, next) => {
    db.all(`SELECT * FROM company_form WHERE company_form_id = ?`, [req.params.id,], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(200).json({rows});
    });
});

// ADD A COMPANY FORM
app.post("/company-form", function (req, res) {
    let reqBody = req.body;
    db.run(`INSERT INTO company_form \
                (company_form_name) \
                VALUES (?)`,
        [reqBody.company_form_name],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }
            res.status(201).json({
                "company_form_id": this.lastID
            })
        });
});