import express from "express";
import mysql from "mysql";

const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hotchocolate1!",
  database: "depozit",
});

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
  const idCategorie = req.params.id_categorie;
  const startDate = req.params.start_date;
  const endDate = req.params.end_date;
  const q =
    "SELECT * FROM vanzari WHERE id_categorie = ? and data >= ? and date <= ?";

  db.query(q, [idCategorie, startDate, endDate], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//add a product
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
    "INSERT INTO vanzari (`id_vanzare`, `data`, `id_produs`, `cantitate`, `pret`, `id_client`) VALUES (?)";
  const values = [
    req.body.id_vanzare,
    req.body.data,
    req.body.id_produs,
    req.body.cantitate,
    req.body.pret,
    req.body.id_client,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Sell has been created successfully");
  });
});

app.listen(8800, () => [console.log("Connected to backend")]);
