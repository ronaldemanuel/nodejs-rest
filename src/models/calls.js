const moment = require('moment');
const conn = require('../database/connection');

class Calls {
    index(res) {
        const sql = 'SELECT * FROM calls;';

        conn.query(sql, (err, results) => {
            if (err) {
                res.status(400).json(err);
            } else if (results.length == 0) {
                res.status(204).json(results);
            } else {
                res.status(200).json(results);
            }
        });
    }

    show(id, res) {
        const sql = 'SELECT * FROM calls WHERE id = ?;';
    
        conn.query(sql, id, (err, result) => {
            const call = result[0];

            if (err) {
                res.status(400).json(err);
            } else if (result.length == 0) {
                res.status(404).json(call);
            } else {
                res.status(200).json(call);
            }
        });
    }

    store(requestCall, res) {
        const created_at = moment().format('YYYY-MM-DD HH:MM:SS');
        const date = moment(requestCall.date, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

        const call = {...requestCall, created_at, date};

        const errors = this.storeValidation(call);

        if (errors.length) {
            res.status(400).json(errors);
        } else {
            const sql = 'INSERT INTO calls SET ?;';
    
            conn.query(sql, call, (err, results) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(201).json(results);
                }
            });
        }
    }

    update(values, id, res) {
        if (values.date) {
            values.date = moment(values.date, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        }

        const sql = 'UPDATE calls SET ? WHERE id=?';

        conn.query(sql, [values, id], (err, results) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(results);
            }
        });
    }

    storeValidation(call) {
        const validClient = call.client.length >= 4;
        const validDate = moment().isSameOrBefore(call.created_at);

        const validation = [
            {
                name: 'client',
                valid: validClient,
                message: 'O cliente deve ter pelo menos 4 caracteres',
            },
            {
                name: 'date',
                valid: validDate,
                message: 'A data deve ser maior ou igual que a data atual',
            },
        ];

        return validation.filter(field => !field.valid);
    }
}

module.exports = new Calls;