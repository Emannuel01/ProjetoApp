const { webservice } = require('../webservice/webserviceClient');
const fs = require("fs");

module.exports = {
    async getFinan(req, res) {
        const { id_client } = req.body;
        const data = JSON.stringify({
            "qtype": "fn_areceber.status",
            "oper": "=",
            "query": "A",
            "pg": "1",
            "rp": "100",
            "sortname": "fn_areceber.id",
            "sortorder": "asc",
            "grid_param": `[{\"TB\":\"fn_areceber.id_cliente\", \"OP\" : \"=\", \"P\" : \"${id_client}\"}]`
        });

        const config = {
            method: 'post',
            url: `${process.env.APP_URL}/fn_areceber`,
            headers: {
                'ixcsoft': 'listar',
                'Authorization': process.env.SECRET_API,
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await webservice(config);
        try {
            if (response.total > 0) {
                return res.status(200).json({
                    type: "sucesso",
                    data: response.registros
                });
            } else {
                return res.status(200).json({
                    type: "error",
                    data: "dados invalidados"
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ mensage: err });
        }
    },
    async getFileFinan(req, res) {
        const { id_finan } = req.body;
        const data = JSON.stringify({
            "boletos": id_finan,
            "juro": "N",
            "multa": "N",
            "atualiza_boleto": "N",
            "tipo_boleto": "arquivo",
            "base64": "S"
        });

        const config = {
            method: 'post',
            url: `${process.env.APP_URL}/get_boleto`,
            headers: {
                'ixcsoft': 'listar',
                'Authorization': process.env.SECRET_API,
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await webservice(config);
        try {
            fs.writeFile('./src/views/files/finan.pdf', response, 'base64', (error) => {
                if (error) throw error;
            });
            if (response) {
                return res.status(200).json({
                    type: "sucesso"
                });
            }
            return res.status(200).json({
                type: "error",
                message: "dados invalidos"
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ mensage: err });
        }
    },
    async filePdf(req, res) {
        fs.readFile('./src/views/files/finan.pdf', (err, data) => {
            return res.status(200).contentType("application/pdf").send(data);
        })
    }
}
