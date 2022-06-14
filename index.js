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
    axios.get('https://auth.tesla.com/oauth2/v3/authorize').then((response) => {
        console.log(response);
        data = response.data
    })
    res.send(res)
})
