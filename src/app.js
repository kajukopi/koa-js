import {config} from "dotenv"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import mongoose from "mongoose"
import renderer from "koa-hbs-renderer"
import Handlebars from 'handlebars';
import path from "path"
import {fileURLToPath} from "url"
import serve from "koa-static"
import {logger} from "./middlewares/handler.js"
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

// Serve static files from the "public" directory
app.use(serve(path.join(__dirname, "..", 'assets'),{
  maxage: 1000 * 60 * 60 * 24, // Cache for 1 day
  hidden: false, // Do not serve hidden files
  gzip: true, // Serve gzip versions of files if available
}));


let options = {
  cacheExpires:  60,
  contentTag:    'content',
  defaultLayout: 'default',
  environment:   'development',
  extension:     '.hbs',
  hbs:           Handlebars.create(),
  paths: {
    views:    path.join(__dirname, 'views'),
    layouts:  path.join(__dirname, 'views/layouts'),
    partials: path.join(__dirname, 'views/partials'),
    helpers:  path.join(__dirname, 'views/helpers')
  },
  Promise: Promise
};


// Setup the template engine
app.use(
  renderer(options)
)


app.use(bodyParser())
app.use(logger(":method :url"))

// Use router middleware
app.use(routerItem.middleware())
app.use(routerHome.routes()).use(routerHome.allowedMethods())
app.use(routerItem.routes()).use(routerItem.allowedMethods())

export default app
