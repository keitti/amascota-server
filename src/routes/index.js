const express = require("express");
const rutas = express();

const usuario = require("../controlador/Usuario");
rutas.post("/usuario/login", usuario.login);
rutas.post("/usuario/reAuth", usuario.reAuth);
rutas.get("/usuario", usuario.listar);
rutas.post("/usuario", usuario.registrar);
rutas.put("/usuario/:id", usuario.actualizar);

const tips = require("../controlador/Tips");
rutas.get("/tips", tips.listar);
rutas.post("/tips", tips.registrar);
rutas.put("/tips/:id", tips.actualizar);
rutas.delete("/tips/:id", tips.eliminar);

const cita = require("../controlador/Citas");
rutas.get("/cita", cita.listar);
rutas.post("/cita", cita.registrar);
rutas.put("/cita/:id", cita.actualizar);
rutas.delete("/cita/:id", cita.eliminar);

const mascota = require("../controlador/Mascota");
rutas.get("/mascota", mascota.listar);
rutas.post("/mascota", mascota.registrar);
rutas.put("/mascota/:id", mascota.actualizar);
rutas.delete("/mascota/:id", mascota.eliminar);

const mascota_ideal = require("../controlador/MascotaIdeal");
rutas.get("/mascota_ideal/:estado", mascota_ideal.listar);
rutas.post("/mascota_ideal", mascota_ideal.registrar);
rutas.put("/mascota_ideal/:id", mascota_ideal.actualizar);
rutas.delete("/mascota_ideal/:id", mascota_ideal.eliminar);

const preguntas = require("../controlador/PreguntasRespuestas");
rutas.get("/preguntas", preguntas.listar);
rutas.post("/preguntas", preguntas.registrar);
rutas.put("/preguntas/:id", preguntas.actualizar);
rutas.delete("/preguntas/:id", preguntas.eliminar);

module.exports = rutas;