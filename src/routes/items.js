import Router from "@koa/router"
import Item from "../models/Item.js"
const router = new Router()

// Define routes
router.get("/items", async (ctx, next) => {
  const items = await Item.find().lean()
  console.log(items);
  await ctx.render("index", {items})
})

router.get("/items/:id", async (ctx) => {
  const item = await Item.findById(ctx.params.id)
  console.log(item)
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
  console.log(item)
  ctx.redirect("/items")
})

router.put("/items/update/:id", async (ctx) => {
  const item = await Item.findByIdAndUpdate({_id: ctx.params.id}, ctx.request.body)
  console.log(item)
  ctx.redirect("/items")
})

router.get("/items/delete/:id", async (ctx) => {
  const item = await Item.findByIdAndDelete(ctx.params.id)
  console.log(item)
  ctx.redirect("/items")
})

export default router
