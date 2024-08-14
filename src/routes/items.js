import Router from "@koa/router"
import Item from "../models/Item.js"
const router = new Router()

// Define routes
router.get("/items", async (ctx, next) => {
  const items = await Item.find().lean()
  await ctx.render("index", {items})
})

router.get("/items/:id", async (ctx) => {
  const item = await Item.findById(ctx.params.id)
  if (item) {
    await ctx.render("item", {item})
  } else {
    ctx.status = 404
    ctx.body = "Item not found"
  }
})

router.post("/items", async (ctx) => {
  const newItem = new Item(ctx.request.body)
  const item = await newItem.save()
  ctx.redirect("/items")
})

router.put("/items/update/:id", async (ctx) => {
  const item = await Item.findByIdAndUpdate({_id: ctx.params.id}, ctx.request.body)
  ctx.redirect("/items")
})

router.get("/items/delete/:id", async (ctx) => {
  const item = await Item.findByIdAndDelete(ctx.params.id)
  ctx.redirect("/items")
})

export default router
