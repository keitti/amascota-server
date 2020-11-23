const Connection = require("../config");
const moment = require("moment");

const registrar = async (req, res) => {
    let { nombre, descripcion, imagen } = req.body;
    let sql = `INSERT INTO tips (nombre,descripcion,imagen, fecha_registro,estado) values (?,?,?,?,?)`;
    let [data] = await Connection.query(sql, [nombre, descripcion, imagen, moment().format('YYYY-MM-DD h:mm:ss'), 1]);
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
        mensaje: "Tip registrado"
    })
};

const listar = async (req, res) => {
    let sql = "SELECT * FROM tips ORDER BY id DESC";
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
    let { nombre, descripcion, imagen } = req.body;

    let sql = `UPDATE tips SET nombre = ?, descripcion = ?, imagen = ? WHERE id = ?`;
    let [result] = await Connection.query(sql, [nombre, descripcion, imagen, id]);
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
        mensaje: "Tip actualizado"
    })
};

const eliminar = async (req, res) => {
    let { id } = req.params;
    let sql = `DELETE FROM tips WHERE id = ?`;
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
        mensaje: "Tip eliminado"
    })
};

module.exports = {
    registrar,
    listar,
    actualizar,
    eliminar,
};