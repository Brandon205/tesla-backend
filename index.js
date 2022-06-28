const dotenv = require('dotenv').config();
const axios = require('axios');
const express = require('express');

const app = express();
const PORT = "8080";

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Ready and connected to the backend on Port: ${PORT}`);
});

app.get('/test', (req, res) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:19006/");
    res.json({'message': 'Hello!'});
})

// app.get('/auth', (req, res) => { // TODO: FIX THIS IT'S NOT WORKING 
//     let data;
//     let options = {
//         "client_id": "ownerapi", // Always ownerapi
//         "code_challenge": "123", // Any Random String
//         "code_challenge_method": "S256", // Always S256
//         "redirect_uri": "https://auth.tesla.com/void/callback", // Always that
//         "response_type": "code", // Always code
//         "scope": "openid email offline_access", // Always "openid email offline_access"
//         "state": "123" // Any Random String
//     }
//     axios.get('https://auth.tesla.com/oauth2/v3/authorize', { params: options }).then((response) => {
//         console.log(response.data);
//         data = response.data
//     })
//     res.send(data)
// })

app.get('/vehicles', (req, res) => {
    const baseURI = 'https://owner-api.teslamotors.com';

    axios.get(baseURI + '/api/1/vehicles', { headers: {'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN} }).then((response) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).send(response.data);
    })
})

app.get('/vehicle/:id', (req, res) => {
    const baseURI = 'https://owner-api.teslamotors.com';

    axios.get(baseURI + '/api/1/vehicles/' + req.params.id, { headers: {'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN} }).then((response) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).send(response.data);
    }).catch((error) => {
        console.log('ERROR!: ', error)
    })
})

app.get('/vehiclecharge/:id', (req, res) => {
    const baseURI = 'https://owner-api.teslamotors.com';

    axios.get(baseURI + `/api/1/vehicles/${req.params.id}/data_request/charge_state`, { headers: {'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN} }).then((response) => {
        res.set("Access-Control-Allow-Origin", "http://localhost:19006/");
        res.status(200).send(response.data);
    }).catch((error) => {
        console.log(error)
    })
})
