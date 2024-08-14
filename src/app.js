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
import routerItem from "./routes/items.js"
import routerHome from "./routes/home.js"
import routerAsset from "./routes/assets.js"
import routerAuth from "./routes/auth.js"


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
  },
  Promise: Promise
}

// Set up views with koa-hbs-render
app.use(render(options));

app.use(bodyParser())
app.use(logger(":method :url"))

// Use router middleware
app.use(routerHome.routes()).use(routerHome.allowedMethods())
app.use(routerItem.routes()).use(routerItem.allowedMethods())

export default app
