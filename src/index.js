// as you can tell i don't backend
// there are probably better ways to do this
// it was fun though!

const fs = require('fs')
const express = require('express')
const app = express()
var vukkyColor = "#00a8f3";

// middleware shit
const nocache = require('nocache');
app.use(nocache());
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hii! It\'s me, the LIT Devs logo API!')
})

app.get('/api/vukky', function (req, res) {
  let vukkyLogo = fs.readFileSync(`${__dirname}/vukky.svg`, 'utf8');
  vukkyLogo = vukkyLogo.replace("$USERSELECTEDCOLORHERE", vukkyColor);
  res.header("Content-Type","image/svg+xml");
  res.send(vukkyLogo);
})

app.post('/api/vukky', function (req, res) {
  if(req.body && req.body.color && /^#[0-9a-fA-F]{6}$/.test(req.body.color)) {
    vukkyColor = req.body.color;
    res.status(200).send("OK");
  } else {
    res.status(400).send("Bad request");
  }
})

app.listen(3000)