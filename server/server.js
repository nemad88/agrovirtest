const sqlite3 = require('sqlite3');
const express = require('express');

const app = express();

const HTTP_PORT = 8000;
app.listen(HTTP_PORT, () => {
  console.log('Server is listening on port ' + HTTP_PORT);
});

app.use(express.json());

// INIT DB (MEMORY)
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    db.run(
      `CREATE TABLE partners( \
            partnerId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            name NVARCHAR(20) NOT NULL,\
            companyFormId INTEGER ,\
            taxNumber NVARCHAR(20) ,\
            companyNumber NVARCHAR(100) ,\
            cityId INTEGER NOT NULL,\
            address NVARCHAR(100) ,\
            phone NVARCHAR(100) ,\ 
            bankAccount NVARCHAR(100) ,\
            comment NVARCHAR(100) \            
        )`,
      (err) => {
        if (err) {
          console.log('Table already exists.');
          return;
        }
        let insert = `INSERT INTO partners \
                          (name, companyFormId, taxNumber, companyNumber, cityId, address, phone, bankAccount, comment) \
                          VALUES (?,?,?,?,?,?,?,?,?)`;

        db.run(insert, [
          'Big',
          1,
          '123456789',
          'ABC123456',
          1,
          'John street 202',
          '+362541234567',
          '123456-789456-123456',
          'This is a comment',
        ]);
        db.run(insert, [
          'Little',
          2,
          '100000000',
          'AFDECDE',
          4,
          'Free road 4',
          '+22222',
          '1234-1444-99999',
          'This is a comment',
        ]);
        db.run(insert, [
          'Smith',
          3,
          '100000000',
          'CD123456',
          3,
          'Long road 4',
          '+12457955',
          '55555-1444-8888',
          'This is a comment',
        ]);
        db.run(insert, [
          'True',
          2,
          '100000000',
          'CD123456',
          1,
          'Baker street 4',
          '+12457955',
          '1444-8888-44444',
          'This is a comment',
        ]);
      }
    );

    db.run(
      `CREATE TABLE company_form( \
            companyFormId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            companyFormName NVARCHAR(20) NOT NULL                        
        )`,
      (err) => {
        if (err) {
          console.log('Table already exists.');
          return;
        }
        let insert = 'INSERT INTO company_form (companyFormName) VALUES (?)';
        db.run(insert, ['Partnership']);
        db.run(insert, ['LLC']);
        db.run(insert, ['Non-Profit']);
        db.run(insert, ['Co-op']);
        db.run(insert, ['Corporation']);
      }
    );

    db.run(
      `CREATE TABLE cities( \
            cityId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            cityName NVARCHAR(20) NOT NULL\                        
        )`,
      (err) => {
        if (err) {
          console.log('Table already exists.');
          return;
        }
        let insert = 'INSERT INTO cities (cityName) VALUES (?)';
        db.run(insert, ['New York']);
        db.run(insert, ['Washington']);
        db.run(insert, ['Texas city']);
        db.run(insert, ['Sidney']);
        db.run(insert, ['London']);
        db.run(insert, ['Manchester']);
      }
    );
  }
});

// GET ONE PARTNER
app.get('/partners/:id', (req, res, next) => {
  var params = [req.params.id];
  db.get(
    'SELECT * FROM partners where partnerId = ?',
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json(row);
    }
  );
});

// GET ALL PARTNER
app.get('/partners', (req, res, next) => {
  db.all(
    `SELECT p.partnerId, p.cityId, p.companyFormId, p.name, p.taxNumber, p.companyNumber, \
                p.address, p.phone, p.bankAccount, p.comment, \
                c.cityName, cf.companyFormName FROM partners p \
                JOIN cities c ON p.cityId = c.cityId \
                JOIN company_form cf ON p.companyFormId = cf.companyFormId `,
    [],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ rows });
    }
  );
});

// ADD NEW PARTNER
app.post('/partners', function (req, res) {
  let reqBody = req.body;
  db.run(
    `INSERT INTO partners (name, companyFormId, taxNumber, \
        companyNumber, cityId, address, phone, bankAccount, comment) \
        VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      reqBody.name,
      reqBody.companyFormId,
      reqBody.taxNumber,
      reqBody.companyNumber,
      reqBody.cityId,
      reqBody.address,
      reqBody.phone,
      reqBody.bankAccount,
      reqBody.comment,
    ],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({
        partnerId: this.lastID,
      });
    }
  );
});

// UPDATE PARTNER
app.patch('/partners/', (req, res, next) => {
  const reqBody = req.body;
  db.run(
    `UPDATE partners set name = ?, companyFormId = ?, taxNumber = ?, \
     companyNumber = ?, cityId = ?, address = ?, phone = ?, bankAccount = ?, comment = ? WHERE partnerId = ?`,
    [
      reqBody.name,
      reqBody.companyFormId,
      reqBody.taxNumber,
      reqBody.companyNumber,
      reqBody.cityId,
      reqBody.address,
      reqBody.phone,
      reqBody.bankAccount,
      reqBody.comment,
      reqBody.partnerId,
    ],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.status(200).json({ updatedID: this.changes });
    }
  );
});

// DELETE PARTNER
app.delete('/partners/:id', (req, res, next) => {
  db.run(`DELETE FROM partners WHERE partnerId = ?`, req.params.id, function (
    err,
    result
  ) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.status(200).json({ deletedID: req.params.id });
  });
});

// GET ALL CITIES
app.get('/cities', (req, res, next) => {
  db.all(`SELECT * FROM cities `, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ rows });
  });
});

// GET A CITY
app.get('/cities/:id', (req, res, next) => {
  db.all(
    `SELECT * FROM cities WHERE cityId = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ rows });
    }
  );
});

// ADD NEW CITY
app.post('/cities', function (req, res) {
  let reqBody = req.body;
  db.run(
    `INSERT INTO cities \
                (cityName) \
                VALUES (?)`,
    [reqBody.cityName],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({
        cityId: this.lastID,
      });
    }
  );
});

// GET ALL COMPANY_FORM
app.get('/company-form', (req, res, next) => {
  db.all(`SELECT * FROM company_form `, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ rows });
  });
});

// GET A COMPANY FORM
app.get('/company-form/:id', (req, res, next) => {
  db.all(
    `SELECT * FROM company_form WHERE companyFormId = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ rows });
    }
  );
});

// ADD A COMPANY FORM
app.post('/company-form', function (req, res) {
  let reqBody = req.body;
  db.run(
    `INSERT INTO company_form \
                (companyFormName) \
                VALUES (?)`,
    [reqBody.companyFormName],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({
        companyFormId: this.lastID,
      });
    }
  );
});
