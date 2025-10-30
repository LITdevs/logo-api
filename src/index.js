// as you can tell i don't backend
// there are probably better ways to do this
// it was fun though!

const fs = require('fs')
const express = require('express')
const app = express()
const vukkyLogo = fs.readFileSync(`${__dirname}/vukky.svg`, 'utf8'); 
const vukkyLogoBG = fs.readFileSync(`${__dirname}/vukkybg.svg`, 'utf8');
let colors = {color: "#00a8f3", bg: "#7289da", flame: "#ff3f3f"};
try {
    colors = JSON.parse(fs.readFileSync(`${__dirname}/../colors.json`, 'utf8'));
} catch (e) {
    if(!e.message.includes("ENOENT")) {
        console.error(e);
        process.exit(1);
    }
}

// middleware stuff
const rateLimit = require("express-rate-limit");
const nocache = require('nocache');
const cors = require('cors');
app.set("trust proxy", process.env.LOGO_PROXY_COUNT || 1)
app.use(nocache());
app.use(express.json());
app.use(cors());
app.use("/resources", express.static('public/resources'));

app.get('/api/vukky', function (req, res) {
  res.header("Content-Type","image/svg+xml");
  res.send(vukkyLogo.replace("$USERSELECTEDCOLORHERE", colors.color));
})

app.get('/api/vukky/bg', function (req, res) {
  res.header("Content-Type","image/svg+xml");
  res.send(vukkyLogoBG.replace("$USERSELECTEDCOLORHERE", colors.color).replace("$USERSELECTEDBGHERE", colors.bg).replace("$USERSELECTEDFLAMEHERE", colors.flame));
})

app.get('/api/color', function (req, res) {
  res.send({"color": colors.color, "bg": colors.bg, "flame": colors.flame});
})

const editRateLimit = rateLimit({
	windowMs: 1000 * 60,
	max: 2,
	handler: function(req, res) {
		res.status(429).send("hey be careful! that's enough for now")
	}
});

app.post('/api/edit', function (req, res) {
  if(!req.body?.color) return res.status(400).send("Bad request: No main color provided");
  if(!req.body?.bg) return res.status(400).send("Bad request: No background color provided");
  if(!req.body?.flame) return res.status(400).send("Bad request: No flame color provided");
  if(!/^#[0-9a-fA-F]{6}$/.test(req.body.color)) return res.status(400).send("Bad request: Main color is not valid");
  if(!/^#[0-9a-fA-F]{6}$/.test(req.body.bg)) return res.status(400).send("Bad request: Background is not valid");
  if(!/^#[0-9a-fA-F]{6}$/.test(req.body.flame)) return res.status(400).send("Bad request: Flame is not valid");
  editRateLimit(req, res, () => {
    colors.color = req.body.color;
    colors.bg = req.body.bg;
    colors.flame = req.body.flame;
    fs.writeFileSync(`${__dirname}/../colors.json`, JSON.stringify(colors));
    console.log("colors were changed to:", colors)
    res.sendStatus(200);
  })
})

app.get('/', function (req, res) {
  res.sendFile('index.html', {root: './public'})
})

app.listen(process.env.LOGO_PORT || 90, () => {
    console.log("yo yo yo it's me logo-api")
})