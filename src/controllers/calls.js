const Calls = require('../models/calls');

module.exports = app => {
    app.get('/atendimentos', (req, res) => res.send('Você está na rota de atendimentos e está realizando um GET'));

    app.post('/atendimentos', (req, res) => {
        console.log(req.body);

        const call = req.body;
        Calls.store(call);

        res.send('Você está na rota de atendimentos e está realizando um POST')
    });
}