// as you can tell i don't backend
// there are probably better ways to do this
// it was fun though!

const fs = require('fs')
const express = require('express')
const app = express()
const vukkyLogo = fs.readFileSync(`${__dirname}/vukky.svg`, 'utf8'); 
const vukkyLogoBG = fs.readFileSync(`${__dirname}/vukkybg.svg`, 'utf8'); 
var vukkyColor = "#00a8f3";

// middleware shit
const nocache = require('nocache');
app.use(nocache());
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hii! It\'s me, the LIT Devs logo API!')
})

app.get('/api/vukky', function (req, res) {
  if(req.query.bg == "true") {
    res.header("Content-Type","image/svg+xml");
    res.send(vukkyLogoBG.replace("$USERSELECTEDCOLORHERE", vukkyColor));
  } else {
    res.header("Content-Type","image/svg+xml");
    res.send(vukkyLogo.replace("$USERSELECTEDCOLORHERE", vukkyColor));
  }
})

app.post('/api/vukky/edit', function (req, res) {
  if(!req.body?.color) return res.status(400).send("Bad request: No color provided");
  if(!/^#[0-9a-fA-F]{6}$/.test(req.body.color)) return res.status(400).send("Bad request: Color is not valid");
  vukkyColor = req.body.color;
  res.sendStatus(200);
})

app.listen(3000)