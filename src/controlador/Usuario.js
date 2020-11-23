const Connection = require("../config");
const moment = require("moment");
const bcrypt = require("bcrypt");

const registrar = async (req, res) => {
    let { nombre, correo, contraseña } = req.body.propietario;
    contraseña = bcrypt.hashSync(contraseña, 10);
    let sql = `INSERT INTO usuario (nombre,correo,contraseña,fecha_registro,estado) values (?,?,?,?,?)`;
    let [data] = await Connection.query(sql, [nombre, correo, contraseña, moment().format('YYYY-MM-DD h:mm:ss'), 1]);
    if (!data) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al registrar"
        })
    } else {
        let { nombre, edad, ultima_fecha_vacunacion, color, pelaje, descripcion } = req.body.mascota;
        sql = `INSERT INTO mascota (nombre, edad, ultima_fecha_vacunacion, color, pelaje, descripcion, id_propietario, fecha_registro, estado) values (?,?,?,?,?,?,?,?,?)`;
        [data] = await Connection.query(sql, [nombre, edad, ultima_fecha_vacunacion, color, pelaje, descripcion, data.insertId, moment().format('YYYY-MM-DD h:mm:ss'), 1]);
        if (!data) {
            return res.json({
                ok: false,
                data: [],
                mensaje: "Usuario registrado - Error al registrar mascota"
            })
        }
        res.json({
            ok: true,
            data,
            mensaje: "Usuario registrado"
        })
    }

};

const listar = async (req, res) => {
    let sql = "SELECT * FROM usuario ORDER BY id DESC";
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

const login = async (req, res) => {
    let { correo } = req.body;

    let sql = `SELECT 
        usuario.id,
        usuario.nombre,
        usuario.correo,
        usuario.contraseña,
        usuario.fecha_registro,
        usuario.estado,
        usuario.rol,
        mascota.nombre as mascota,
        mascota.edad,
        mascota.ultima_fecha_vacunacion,
        mascota.color,
        mascota.pelaje,
        mascota.descripcion,
        mascota.id as idMascota
    FROM usuario, mascota WHERE correo = ? AND mascota.id_propietario = usuario.id`;
    const [rows, fields] = await Connection.query(sql, [correo]);
    if (!rows.length) {
        return res.json({
            ok: false,
            data: []
        })
    }
    if (!bcrypt.compareSync(req.body.contraseña, rows[0].contraseña)) {
        res.json({
            ok: false,
            data: {}
        })
    }
    let { contraseña, ...data } = rows[0];
    res.json({
        ok: true,
        data
    })
};
const reAuth = async (req, res) => {
    let { correo } = req.body;
    let sql = `SELECT 
        usuario.id,
        usuario.nombre,
        usuario.correo,
        usuario.contraseña,
        usuario.fecha_registro,
        usuario.estado,
        usuario.rol,
        mascota.nombre as mascota,
        mascota.edad,
        mascota.ultima_fecha_vacunacion,
        mascota.color,
        mascota.pelaje,
        mascota.descripcion,
        mascota.id as idMascota
    FROM usuario, mascota WHERE correo = ? AND mascota.id_propietario = usuario.id`;
    const [rows, fields] = await Connection.query(sql, [correo]);
    if (!rows.length) {
        return res.json({
            ok: false,
            data: []
        })
    }
    console.log("object")
    res.json({
        ok: true,
        data: rows[0]
    })
};

const actualizar = async (req, res) => {
    let { id } = req.params;
    let { nombre, correo, contraseña } = req.body;

    let sql = `UPDATE usuario SET nombre = ?, correo = ?, contraseña = ? WHERE id = ?`;
    let [result] = await Connection.query(sql, [nombre, correo, contraseña, id]);
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
        mensaje: "Usuario actualizado"
    })
};

// const delQuestion = async (id) => {
//   console.log(id)
//   let sql = `DELETE FROM preguntas WHERE id = ?`;
//   let [result] = await Connection.query(sql, [id]);
//   if (!result) {
//     return "Error al eliminar"
//   }
//   return "Pregunta eliminada";
// };

module.exports = {
    registrar,
    listar,
    login,
    reAuth,
    actualizar
};