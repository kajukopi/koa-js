import {config} from "dotenv"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import mongoose from "mongoose"
import hbs from "koa-hbs"
import routerItem from "./routes/items.js"
import path from "path"
import {fileURLToPath} from "url"
import routerAsset from "./routes/assets.js"
import routerAuth from "./routes/auth.js"
config()
// Initialize Koa application
const app = new Koa()

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Setup the template engine
app.use(
  hbs.middleware({
    viewPath: path.join(__dirname, "views"),
  })
)

// Middleware
app.use(bodyParser())

// Use router middleware
app.use(routerItem.routes()).use(routerItem.allowedMethods())

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})

export default app
