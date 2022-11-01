require('./alias.config');
require("dotenv-safe").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const expressSanitizer = require("express-sanitizer");
const helmet = require("helmet");
const app = express();
const path = require("path");
const publicPath = path.join(__dirname, "public");
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const ip = require("ip");
const development = process.env.NODE_ENV != "production";
const production = !development;
const io = require("socket.io").apply(
  null,
  (() => {
    return production ? [server] : [server, { cors: { origin: `*` } }];
  })()
);
const { Game, Log, GraphQL } = require("./engine");
const { exit } = require("process");
const game = new Game(io);
const package = require("./frontend/package.json");


Log("publicPath:", publicPath);
Log("development:", development);

//remove powered-by
app.disable("x-powered-by");

// app use
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use(helmet());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader(
    "Content-Security-Policy",
    [
      `default-src 'unsafe-inline'`,
      `font-src 'self'`,
      `img-src 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com`,
      `script-src 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com`,
      `script-src-elem 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com`,
      `connect-src 'self' *.google-analytics.com`,
      `style-src 'self' 'unsafe-inline'`,
      `frame-src 'self'`,
      `media-src 'self' 'unsafe-inline' data:`,
    ]
    .join("; ")
  );
  app.use(cors());
  next();
});
app.options("*", cors());

//send static files
app.use(express.static(publicPath));

//start planning poker
io.on("connection", socket => game.start(socket));

//check if channel exists
app.get("/channel/:channel", (req, res) => {
  res.status( game.hasRoom(req.params.channel) ? 200 : 404 ).send('ok');
});

//routes for static
app.get("/|/:session", (req, res) => {
  res.sendFile(path.join(publicPath, "/index.html"));
});

//on error
server.on("error", (error) => {
  if (error.syscall !== "listen") throw error;

  //get port or pipe
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      Log(bind + " requires elevated privileges");
      exit(1);
    case "EADDRINUSE":
      Log(bind + " is already in use");
      exit(1);
    default:
      throw error;
  }
});

//listen
server.on("listening", () => {
  const addr = server.address(),
        bind = typeof addr === "string" ? addr : addr.port;

  //log start
  Log(`Listening: ${ip.address()}:${bind} - ${JSON.stringify(addr)}`);

  //start "cronjob"
  game.cronjob();
});

//start server
server.listen(port);
