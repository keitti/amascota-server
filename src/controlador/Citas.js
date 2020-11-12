const Connection = require("../config");
const moment = require("moment");

const registrar = async (req, res) => {
    console.log(req.body)
    let { nombre, fecha, descripcion } = req.body;
    let sql = `INSERT INTO cita (nombre,fecha,descripcion,fecha_registro,estado) values (?,?,?,?,?)`;
    let [data] = await Connection.query(sql, [nombre, fecha, descripcion, moment().format('YYYY-MM-DD h:mm:ss'), 1]);
    if (!data) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al registrar"
        })
    }
    res.json({
        ok: true,
        data,
        mensaje: "Cita registrada"
    })
};

const listar = async (req, res) => {
    let sql = "SELECT * FROM cita ORDER BY id DESC";
    const [rows, fields] = await Connection.query(sql);
    if (!rows) {
        return res.json({
            ok: false,
            data: []
        })
    }
    res.json({
        ok: true,
        data: rows
    })
};

const actualizar = async (req, res) => {
    let { id } = req.params;
    let { nombre, fecha, descripcion, estado = 1 } = req.body;

    let sql = `UPDATE cita SET nombre = ?, fecha = ?, descripcion = ?, estado = ? WHERE id = ?`;
    let [result] = await Connection.query(sql, [nombre, fecha, descripcion, estado, id]);
    if (!result) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al actualizar"
        })
    }
    res.json({
        ok: true,
        data: result,
        mensaje: "Cita actualizada"
    })
};

const eliminar = async (req, res) => {
    let { id } = req.params;
    let sql = `DELETE FROM cita WHERE id = ?`;
    let [result] = await Connection.query(sql, [id]);
    if (!result) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al eliminar"
        })
    }
    res.json({
        ok: true,
        data: result,
        mensaje: "Cita eliminada"
    })
};

module.exports = {
    registrar,
    listar,
    actualizar,
    eliminar,
};