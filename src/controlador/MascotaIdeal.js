const Connection = require("../config");
const moment = require("moment");

const registrar = async (req, res) => {
    console.log(req.body)
    let { id_propietario } = req.body;
    let sql = `INSERT INTO mascota_ideal (id_propietario,estado) values (?,?)`;
    let [data] = await Connection.query(sql, [id_propietario, 1]);
    if (!data) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al registrar"
        })
    }
    let { respuestas } = req.body;
    sql = `INSERT INTO respuestas_propietario (pregunta,respuesta, id_mascota_ideal) values (?,?,?)`;
    let result;
    for (let i = 0; i < respuestas.length; i++) {
        [result] = await Connection.query(sql, [respuestas[i].pregunta, respuestas[i].respuesta, data.insertId]);
    }
    if (!result) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al registrar"
        })
    }
    res.json({
        ok: true,
        data: result,
        mensaje: "Solisitud de mascota ideal registrada"
    })
};

const listar = async (req, res) => {
    let { estado } = req.params;
    let { id } = req.query;
    let filter = "";
    if (id) {
        filter += " AND id_propietario = " + id;
    }
    let sql = "SELECT * FROM mascota_ideal WHERE estado = ? " + filter + " ORDER BY id DESC";
    const [rows, fields] = await Connection.query(sql, [estado]);
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
    let { nombre } = req.body;

    let sql = `UPDATE mascota_ideal SET nombre = ?, estado = ? WHERE id = ?`;
    let [result] = await Connection.query(sql, [nombre, 0, id]);
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
        mensaje: "Respuesta de tu mascota ideal realizada"
    })
};

const eliminar = async (req, res) => {
    let { id } = req.params;
    let sql = `DELETE FROM mascota_ideal WHERE id = ?`;
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
        mensaje: "Mascota ideal eliminada"
    })
};

module.exports = {
    registrar,
    listar,
    actualizar,
    eliminar,
};