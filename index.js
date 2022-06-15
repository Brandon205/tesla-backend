const dotenv = require('dotenv').config(); // Can use as process.env._NAME
const axios = require('axios');
const express = require('express');

const app = express();
const PORT = "8080";

const htmlparser2 = require('htmlparser2');

app.listen(PORT, () => {
    console.log(`Ready and connected to the backend on Port: ${PORT}`);
});

app.get('/home', (req, res) => {
    res.json({'message': 'Hello!'});
})

app.get('/auth', (req, res) => {
    let options = {
        "client_id": "ownerapi", // Always ownerapi
        "code_challenge": "123", // Any Random String
        "code_challenge_method": "S256", // Always S256
        "redirect_uri": "https://auth.tesla.com/void/callback", // Always that
        "response_type": "code", // Always code
        "scope": "openid email offline_access", // Always "openid email offline_access"
        "state": "123" // Any Random String
    }

    axios.get('https://auth.tesla.com/oauth2/v3/authorize', { params: options }).then((response) => {
        // COOKIE INFO: response.headers['set-cookie']
        let codes = {};
        const parser = new htmlparser2.Parser({
            onopentag(name, attributes) {
            if (name === 'input' && attributes.name === '_csrf') {
                codes._csrf = attributes.value;
            } else if (name === 'input' && attributes.name === '_phase') {
                codes._phase = attributes.value;
            } else if (name === 'input' && attributes.name === 'transaction_id') {
                codes.transaction_id = attributes.value;
            } else if (name === 'input' && attributes.name === 'cancel') {
                codes.cancel = attributes.value;
            }
            }
        })

        parser.write(response.data);
        parser.end();
        codes.identity = process.env.EMAIL;
        codes.credential = process.env.PASSWORD;
        
        console.log(codes)
        console.log(response.headers['set-cookie'])
        res.status(200).send("all good")

        // axios.post('https://auth.tesla.com/oauth2/v3/authorize', { headers: {'Content-Type': 'application/x-www-form-urlencoded', Cookie: response.headers['set-cookie']}, params: options, data: codes}).then((res) => {
        //     console.log(res);
        //     res.status(302).send(res.data);
        // }).catch((error) => { // POST request error
        //     console.log('ERROR ON POST: ', error)
        // })
    }).catch((error) => { // GET request error
        console.log('ERROR ON GET: ', error)
    })
})
