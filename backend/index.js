import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hotchocolate1!",
  database: "depozit",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello, this is the backend for wherehouse!");
});

app.get("/categorii", (req, res) => {
  const q = "SELECT * from categorii";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/produse", (req, res) => {
  const q = "SELECT * from produse";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/categorii/:idCategorie", (req, res) => {
  const idCategorie = req.params.idCategorie;
  const q = "SELECT * FROM produse WHERE id_categorie = ?";

  db.query(q, [idCategorie], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/vanzari", (req, res) => {
  const { categorie, start_date, end_date } = req.query;
  const q =
    "SELECT * FROM vanzari INNER JOIN produse ON produse.id_produs = vanzari.id_produs WHERE id_categorie = ? and data >= ? and data <= ?";
  db.query(q, [categorie, start_date, end_date], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/raport-produse", (req, res) => {
  const { produs, start_date, end_date } = req.query;
  const q =
    "SELECT * FROM vanzari WHERE id_produs = ? and data >= ? and data <= ?";
  db.query(q, [produs, start_date, end_date], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/raport/:year", (req, res) => {
  const year = req.params.year;
  const q = `
    SELECT 
      YEAR(data) AS an, 
      MONTH(data) AS luna, 
      produse.nume_produs AS produs, 
      categorii.nume_categorie AS categorie, 
      SUM(vanzari.cantitate) AS cantitate_vanduta 
    FROM vanzari 
      INNER JOIN produse ON produse.id_produs = vanzari.id_produs 
      INNER JOIN categorii ON categorii.id_categorie = produse.id_categorie 
    WHERE YEAR(data) = ? 
    GROUP BY YEAR(data), MONTH(data), produse.id_produs 
    ORDER BY YEAR(data), MONTH(data), cantitate_vanduta DESC 
  `;
  db.query(q, [year], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
    // const results = {};
    // for (const row of data) {
    //   const monthKey = `${row.an}-${row.luna}`;
    //   if (!results[monthKey]) {
    //     results[monthKey] = {
    //       luna: row.luna,
    //       an: row.an,
    //       categorie_ceruta: {
    //         denumire: row.categorie,
    //         cantitate_vanduta: row.cantitate_vanduta,
    //       },
    //       produs_vandut: {
    //         denumire: row.produs,
    //         cantitate_vanduta: row.cantitate_vanduta,
    //       },
    //     };
    //   } else {
    //     if (row.cantitate_vanduta > results[monthKey].produs_vandut.cantitate_vanduta) {
    //       results[monthKey].produs_vandut.denumire = row.produs;
    //       results[monthKey].produs_vandut.cantitate_vanduta = row.cantitate_vanduta;
    //     }
    //     if (row.cantitate_vanduta > results[monthKey].categorie_ceruta.cantitate_vanduta) {
    //       results[monthKey].categorie_ceruta.denumire = row.categorie;
    //       results[monthKey].categorie_ceruta.cantitate_vanduta = row.cantitate_vanduta;
    //     }
    //   }
    // }
    // const finalResult = Object.values(results);
    //return res.json(finalResult);
  });
});

// add a product
app.post("/adaugare-produs", (req, res) => {
  const q =
    "INSERT INTO produse (`id_produs`, `nume_produs`, `id_categorie`, `pret`, `poza`) VALUES (?)";
  const values = [
    req.body.id_produs,
    req.body.nume_produs,
    req.body.id_categorie,
    req.body.pret,
    req.body.poza,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product has been created successfully");
  });
});

//add a sell
app.post("/cart", (req, res) => {
  const q =
    "INSERT INTO vanzari (`id_vanzare`, `data`, `id_produs`, `cantitate`, `pret`) VALUES (?)";
  const values = [
    req.body.id_vanzare,
    req.body.data,
    req.body.id_produs,
    req.body.cantitate,
    req.body.pret,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Sell has been created successfully");
  });
});

app.listen(8800, () => [console.log("Connected to backend")]);
