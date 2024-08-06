const express = require('express');
const mp = require('mercadopago');
const { v4: uuidv4 } = require('uuid');
const app = express();

const MercadoPagoClient = new mp.MercadoPagoConfig({
    accessToken: "TEST-5481521988989141-080421-ce1e66ef74ee567ea9bf975562f0ac2e-329347862"
})

const MercadoPagoPayment = new mp.Payment(MercadoPagoClient);
const MercadoPagoPreferences = new mp.Preference(MercadoPagoClient);


app.get('/', (request, response) => {
    response.send('Olá Mercado pago')
})

app.post('/notificacao', (request, response) => {
    console.log(request.query);

    var id = request.query.id;

    setTimeout(() => {
        console.log('Começou rodar...')
        var filtro = {
            "order.id": id
        }

        MercadoPagoPayment.get({
            id: id
        }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        })
        
    }, 10000);

    response.send("OK");
})

app.get('/teste', (request, response) => {
    console.log("Tentando rota")
    response.send('Tentando rota')
})

app.get('/pagar', async (request, response) => {

    // armazenar no banco:
    // id // codigo // pagador // status
    
    let codigo = uuidv4();
    let email_pagador = "advogado@gmail.com";

    let body = {
        items: [
            item = {
                id: codigo,
                title: 'AdvogandoPros - Plano A',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: 149.90
            }
        ],
        payer: {
            email: email_pagador
        },
        external_reference: codigo,
    }

    try {
        var pagamento = await MercadoPagoPreferences.create({body})
        return response.redirect(pagamento.sandbox_init_point)
    } catch (error) {
        console.log('Errp: ', error)
        return response.send('erro: ' + error.message);
    }
})


app.listen(3000, (req, res) => {
    console.log('Servidor rodando!!! ' + 'http://localhost:3000')
})