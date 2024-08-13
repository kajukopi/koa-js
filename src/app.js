import Koa from "koa"
import Router from "koa-router"
import bodyParser from "koa-bodyparser"
import mongoose from "mongoose"
import render from "koa-hbs"

// Initialize Koa application
const app = new Koa()
const router = new Router()

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/koa-hbs-mongoose-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Define a Mongoose schema and model
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
})

const Item = mongoose.model("Item", ItemSchema)

// Setup the template engine
app.use(
  render({
    viewPath: "./views",
    defaultLayout: "main",
  })
)

// Middleware
app.use(bodyParser())

// Define routes
router.get("/", async (ctx) => {
  const items = await Item.find()
  await ctx.render("index", {items})
})

router.get("/item/:id", async (ctx) => {
  const item = await Item.findById(ctx.params.id)
  if (item) {
    await ctx.render("item", {item})
  } else {
    ctx.status = 404
    ctx.body = "Item not found"
  }
})

router.post("/item", async (ctx) => {
  const newItem = new Item(ctx.request.body)
  await newItem.save()
  ctx.redirect("/")
})

router.get("/item/delete/:id", async (ctx) => {
  await Item.findByIdAndDelete(ctx.params.id)
  ctx.redirect("/")
})

// Use router middleware
app.use(router.routes()).use(router.allowedMethods())

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})
