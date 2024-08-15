// src/app.js
import { config } from "dotenv"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import mongoose from "mongoose"
import serve from "koa-static"
import path from "path"
import { fileURLToPath } from "url"
import render from "koa-hbs-renderer";
import Handlebars from "handlebars";
import { logger } from "./middlewares/handler.js"

// Config env
config()

// Initialize Koa application
const app = new Koa()

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)

// Url Path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(serve(path.join(__dirname, "..", 'assets'), {
  maxage: 1000 * 60 * 60 * 24,
  hidden: false,
  gzip: true,
}));

// Set up views with koa-hbs-render
const options = {
  cacheExpires: 60,
  contentTag: 'content',
  defaultLayout: 'default',
  environment: 'development',
  extension: '.hbs',
  hbs: Handlebars.create(),
  paths: {
    views: path.join(__dirname, 'views'),
    layouts: path.join(__dirname, "views", 'layouts'),
    partials: path.join(__dirname, "views", 'partials'),
    // helpers: path.join(__dirname, "views", 'helpers'),
  },
  Promise: Promise
}

options.hbs.registerHelper("is", function (a, b, options) {
  return (a === b) ? options.fn(this) : options.inverse(this);
})
options.hbs.registerHelper("uppercase", function (str) {
  return str.toUpperCase();
})



options.hbs.registerHelper("editable", function (text) {
  if (!text.indexOf('_')) return JSON.stringify(false)
  return JSON.stringify(true)
})


options.hbs.registerHelper("formatDate", function (date, format) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
})

app.use(render(options));
app.use(bodyParser())
app.use(logger(":method :url"))



// Use import Router
import routerAssets from "./routes/Assets.js";
import routerAuths from "./routes/Auths.js";
import routerRooms from "./routes/Rooms.js";
import routerInvoices from "./routes/Invoices.js";
import routerReservations from "./routes/Reservations.js";
import routerServices from "./routes/Services.js";
import routerUsers from "./routes/Users.js";

// Use router middleware
app.use(routerAssets.routes()).use(routerAssets.allowedMethods())
app.use(routerAuths.routes()).use(routerAuths.allowedMethods())
app.use(routerRooms.routes()).use(routerRooms.allowedMethods())
app.use(routerInvoices.routes()).use(routerInvoices.allowedMethods())
app.use(routerReservations.routes()).use(routerReservations.allowedMethods())
app.use(routerServices.routes()).use(routerServices.allowedMethods())
app.use(routerUsers.routes()).use(routerUsers.allowedMethods())

export default app
