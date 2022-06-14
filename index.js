const express = require('express');
const app = express();
const PORT = "8080";

app.listen(PORT, () => {
    console.log(`Connected to backend on Port: ${PORT}`);
});

app.get('/home', (req, res) => {
    res.json({'message': 'Hello world'});
})
