const axios = require('axios');
const express = require('express');

const app = express();
const PORT = "8080";

const htmlparser2 = require('htmlparser2');

app.listen(PORT, () => {
    console.log(`Connected to backend on Port: ${PORT}`);
});

app.get('/home', (req, res) => {
    const testHTML = 
    `<form method="post" id="form">
        <input type="hidden" name="_csrf" value="JSZgcKOu-WhCO5Ox5flqrsJk6zsR_o3Hvwm0" />
        <input type="hidden" name="_phase" value="identity" />
        <input type="hidden" name="transaction_id" value="p5rpfsDx" />
        <input type="hidden" name="cancel" value="" id="form-input-cancel" />
    </form>`
    let parser = new DOMParser()
    let parsed = parser.parseFromString(testHTML)
    console.log(parsed)

    res.json({'message': 'Hello!'});
})

app.get('/auth', (req, res) => {
    let data;
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
        // data = response.data;
        // res.status(200).send(data);
        let codes = {}
        const parser = new htmlparser2.Parser({
            onopentag(name, attributes) {
            if (name === 'input' && attributes.name === '_csrf') {
                codes._csrf = attributes.value
                // console.log(attributes.value)
            } else if (name === 'input' && attributes.name === '_phase') {
                codes._phase = attributes.value
                // console.log(attributes.value)
            } else if (name === 'input' && attributes.name === 'transaction_id') {
                codes.transaction_id = attributes.value
                // console.log(attributes.value)
            } else if (name === 'input' && attributes.name === 'cancel') {
                codes.cancel = attributes.value
                // console.log(attributes.value)
            }
            }
        })

        parser.write(response.data)
        parser.end()
        res.status(200).send(codes)
    })
})
