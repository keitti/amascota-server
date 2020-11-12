const Connection = require("../config");
const moment = require("moment");

const registrar = async (req, res) => {
    let { nombre, edad, ultima_fecha_vacunacion, color, pelaje, descripcion, id_propietario } = req.body.mascota;
    sql = `INSERT INTO mascota (nombre, edad, ultima_fecha_vacunacion, color, pelaje, descripcion, id_propietario, fecha_registro, estado) values (?,?,?,?,?,?,?,?,?)`;
    [data] = await Connection.query(sql, [nombre, edad, ultima_fecha_vacunacion, color, pelaje, descripcion, id_propietario, moment().format('YYYY-MM-DD h:mm:ss'), 1]);
    if (!data) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al registrar mascota"
        })
    }
    res.json({
        ok: true,
        data,
        mensaje: "Mascota registrado"
    })
};

const listar = async (req, res) => {
    let sql = "SELECT * FROM mascota ORDER BY id DESC";
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
    let { nombre, edad, ultima_fecha_vacunacion, color, pelaje, descripcion,estado=1 } = req.body.mascota;

    let sql = `UPDATE mascota SET nombre = ?, edad = ?, ultima_fecha_vacunacion = ?, color = ?, pelaje = ?, descripcion = ?, estado=? WHERE id = ?`;
    let [result] = await Connection.query(sql, [nombre, edad, ultima_fecha_vacunacion, color, pelaje, descripcion,estado, id]);
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
        mensaje: "Mascota actualizada"
    })
};

const eliminar = async (req, res) => {
    let { id } = req.params;
    let sql = `DELETE FROM mascota WHERE id = ?`;
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
        mensaje: "Mascota eliminada"
    })
};

module.exports = {
    registrar,
    listar,
    actualizar,
    eliminar,
};