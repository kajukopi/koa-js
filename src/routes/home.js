import Router from "@koa/router"
import Item from "../models/Item.js"
const router = new Router()

// Define routes
router.get("/", async (ctx, next) => {
  const items = await Item.find().lean()
  await ctx.render("index", {items})
})

export default router
