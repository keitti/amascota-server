const Connection = require("../config");
const moment = require("moment");

const registrar = async (req, res) => {
    console.log(req.body)
    let { nombre } = req.body;
    let sql = `INSERT INTO preguntas (nombre) values (?)`;
    let [nuevaPregunta] = await Connection.query(sql, [nombre]);
    if (!nuevaPregunta) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al registrar"
        })
    } else {
        let { respuestas } = req.body;
        sql = `INSERT INTO respuestas (nombre, id_pregunta) values (?,?)`;
        let data;
        for (let i = 0; i < respuestas.length; i++) {
            {
                [data] = await Connection.query(sql, [respuestas[i], nuevaPregunta.insertId]);
            }
        }

        if (!data) {
            return res.json({
                ok: false,
                data: [],
                mensaje: "Pregunta registrada - Error al registrar las respuestas"
            })
        }
        res.json({
            ok: true,
            data,
            mensaje: "Pregunta registrada"
        })
    }

};

const listar = async (req, res) => {
    let sql = "SELECT *  FROM preguntas ORDER BY id DESC";
    const [preguntas] = await Connection.query(sql);
    if (!preguntas) {
        return res.json({
            ok: false,
            data: []
        })
    }
    let data = [];
    sql = "SELECT *  FROM respuestas WHERE id_pregunta = ?";

    for (let i = 0; i < preguntas.length; i++) {
        const [respuestas] = await Connection.query(sql, [preguntas[i].id]);
        if (!respuestas) {
            return res.json({
                ok: false,
                data: []
            })
        }
        preguntas[i].respuestas = respuestas;
        data.push(preguntas[i])
    }
    res.json({
        ok: true,
        data
    })
};

const actualizar = async (req, res) => {
    let { id } = req.params;
    let { nombre } = req.body;
    let sql = `UPDATE preguntas SET nombre = ? WHERE id = ?`;
    let [nuevaPregunta] = await Connection.query(sql, [nombre, id]);
    if (!nuevaPregunta) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al actualizar"
        })
    } else {
        let { respuestas } = req.body;
        sql = `UPDATE respuestas SET nombre = ? WHERE id = ?`;
        for (let i = 0; i < respuestas.length; i++) {
            if (respuestas[i].del) {
                let del = `DELETE FROM respuestas WHERE id = ?`;
                await Connection.query(del, [respuestas[i].id])
            } else if (respuestas[i].id > 1) {
                await Connection.query(sql, [respuestas[i].nombre, respuestas[i].id])
            } else if (respuestas[i].id == 0) {
                let newSql = `INSERT INTO respuestas (nombre, id_pregunta) values (?,?)`;
                await Connection.query(newSql, [respuestas[i].nombre, id])
            }
        }
        res.json({
            ok: true,
            mensaje: "Pregunta actualizada"
        })
    }
};

const eliminar = async (req, res) => {

    let { id } = req.params;
    let { respuestas } = req.body;
    let sql = `DELETE FROM respuestas WHERE id = ?`;
    let pregunta = null;
    for (let i = 0; i < respuestas.length; i++) {
        {
            [pregunta] = await Connection.query(sql, [respuestas[i].id]);
        }
    }
    if (!pregunta) {
        return res.json({
            ok: false,
            data: [],
            mensaje: "Error al eliminar"
        })
    }
    sql = `DELETE FROM preguntas WHERE id = ?`;
    await Connection.query(sql, [id]);
    res.json({
        ok: true,
        mensaje: "Pregunta eliminada"
    });
};

module.exports = {
    registrar,
    listar,
    eliminar,
    actualizar
};