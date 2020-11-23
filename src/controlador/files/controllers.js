const path = require('path');

const setFile = (req, res) => {
    let { name } = req.params;
    let { files } = req;
    let array = name.split("__");
    let img = files[array[1]];
    img.mv(`./src/upLoads/${name}`, err => {
        if (err) {
            return res.json({
                ok: false
            });
        }
        res.json({
            ok: true,
            message: "File upload"
        })
    });
}

const getFile = (req, res) => {
    let ruta = path.join(__dirname, `../../upLoads/`, req.params.name)

    return res.sendFile(ruta);
}

module.exports = {
    setFile,
    getFile
}