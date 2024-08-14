import {config} from "dotenv"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import mongoose from "mongoose"
import renderer from "koa-hbs-renderer"
import routerItem from "./routes/items.js"
import path from "path"
import {fileURLToPath} from "url"
import serve from "koa-static"
import {logger} from "./middlewares/handler.js"
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

// Setup the template engine
app.use(
  renderer({
    paths: {
      views: path.join(__dirname, "views"),
    },
  })
)

// Middleware
const publicFiles = serve("/assets", path.join(__dirname, "..", "assets"))
publicFiles._name = "static /public"
app.use(publicFiles)
app.use(bodyParser())
app.use(logger(":method :url"))
// Use router middleware
app.use(routerItem.middleware())
app.use(routerItem.routes()).use(routerItem.allowedMethods())

export default app
