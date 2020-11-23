const Connection = require("../config");
const moment = require("moment");

const registrar = async (req, res) => {
    console.log(req.body)
    let { id_propietario } = req.body;
    let sql = `INSERT INTO mascota_ideal (id_propietario,fecha_registro,estado) values (?,?,?)`;
    let [data] = await Connection.query(sql, [id_propietario, moment().format('YYYY-MM-DD h:mm:ss'), 1]);
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
    let { id, estado } = req.query;
    let filter = "";
    let values = []
    if (id) {
        filter = "AND mascota_ideal.id_propietario = ? ";
        values.push(id);
        if (estado) {
            filter += "AND mascota_ideal.estado = ? "
            values.push(estado);
        }
    }
    filter += "ORDER BY id DESC";
    let sql = "SELECT mascota_ideal.*, usuario.nombre as propietario, usuario.correo FROM mascota_ideal, usuario WHERE usuario.id = mascota_ideal.id_propietario " + filter;
    const [rows, fields] = await Connection.query(sql, values);

    if (rows.length) {
        for (let i = 0; i < rows.length; i++) {
            let resSql = "SELECT respuestas_propietario.pregunta, respuestas_propietario.respuesta FROM respuestas_propietario, mascota_ideal WHERE respuestas_propietario.id_mascota_ideal = mascota_ideal.id ";
            const [res, fields] = await Connection.query(resSql);
            rows[i].respuestas = res;
        }
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