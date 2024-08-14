// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next()
  }
  res.redirect("/login")
}

// Middleware to authorize based on role
const authorizeRole = (role) => (req, res, next) => {
  if (req.session.role === role) {
    return next()
  }
  res.status(403).render("error", { message: "Access denied" })
}

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).render("error", { message: error.details[0].message })
  next()
}

function logger(format) {
  format = format || ':method ":url"'

  return async function (ctx, next) {
    const str = format.replace(":method", ctx.method).replace(":url", ctx.url)

    console.log(str)

    await next()
  }
}

export { isAuthenticated, authorizeRole, validate, logger }
