const axios = require('axios');
const express = require('express');
const app = express();
const PORT = "8080";

app.listen(PORT, () => {
    console.log(`Connected to backend on Port: ${PORT}`);
});

app.get('/home', (req, res) => {
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
        console.log(response.data);
        data = response.data
    })
    res.send(data)
})
