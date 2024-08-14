import Router from "@koa/router"
import Item from "../models/Item.js"
const router = new Router()

// Define routes
router.get("/", async (ctx) => {
  const items = await Item.find().lean()
  await ctx.render("home", { items })
})

export default router
