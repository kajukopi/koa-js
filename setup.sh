#!/bin/bash
# Set the directory paths
DIR_PATH="./src"

# Create the directory if it doesn't exist
mkdir -p "$DIR_PATH"

mkdir -p src/models src/routes src/middlewares src/views assets/css assets/js assets/img assets/webfonts

touch src/app.js src/index.js .env .gitignore 
# Create index.js
cat > src/index.js <<EOF
require("dotenv").config()
const app = require("./app")
const http = require("http")
const port = normalizePort(process.env.PORT || "3000")
app.set("port", port)
const server = http.createServer(app)
server.listen(port, "0.0.0.0")
server.on("error", onError)
server.on("listening", onListening)
function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}
function onError(error) {
  if (error.syscall !== "listen") {
    throw error
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges")
      process.exit(1)
      break
    case "EADDRINUSE":
      console.error(bind + " is already in use")
      process.exit(1)
      break
    default:
      throw error
  }
}
function onListening() {
  const addr = server.address()
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port
  console.log("App started. Listening on " + bind)
}
EOF

# Create app.js
cat > src/app.js <<EOF
require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const logger = require("morgan")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")
const hbs = require("hbs")
hbs.registerHelper("uppercase", function (text, options) {
  return text.toUpperCase()
})
hbs.registerHelper("lowercase", function (text, options) {
  return text.toLowerCase()
})
hbs.registerHelper("localDate", function (date, options) {
  return new Date(date).toLocaleDateString("id-ID")
})
hbs.registerPartials(path.join(__dirname, "views/partials"))
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected!")
  })
  .catch((error) => {
    console.log(error)
  })

const app = express()
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(cookieParser())
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))
app.use("/assets", express.static(path.join(__dirname, "..", "/assets")))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
)
// Routes
const { authRouter, isAuthenticated, authorizeRole } = require("./routes/auth")
const clientRoutes = require("./routes/clients")
// Protecting routes
app.use("/clients", isAuthenticated, clientRoutes)
module.exports = app
EOF

# Create routes/assets.js
cat > src/routes/assets.js <<EOF
const express = require("express")
const router = express.Router()
const Asset = require("../models/Asset")

// Get all assets
router.get("/", async (req, res) => {
  const assets = await Asset.find().lean()
  res.json(assets)
})

// Add a new asset
router.post("/", async (req, res) => {
  const newAsset = new Asset(req.body)
  await newAsset.save()
  res.status(201).json(newAsset)
})

// Get a specific asset
router.get("/:id", async (req, res) => {
  const asset = await Asset.findById(req.params.id)
  res.json(asset)
})

// Update a asset
router.put("/:id", async (req, res) => {
  const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, {new: true})
  res.json(updatedAsset)
})

// Delete a asset
router.delete("/:id", async (req, res) => {
  await Asset.findByIdAndDelete(req.params.id)
  res.status(204).send()
})

module.exports = router
EOF

# Create routes/auth.js
cat > src/routes/auth.js <<EOF
const express = require("express")
const User = require("../models/User")
const router = express.Router()

// Login
router.post("/login", async (req, res) => {
  const {username, password} = req.body
  const user = await User.findOne({username})
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).render("login", {error: "Invalid credentials"})
  }
  req.session.userId = user._id
  req.session.role = user.role
  res.redirect("/")
})

router.post("/register", async (req, res) => {
  const {username, password, role} = req.body

  // Basic validation
  if (!username || !password) {
    return res.status(400).render("register", {error: "Please fill in all fields"})
  }

  // Check if the username is already taken
  const existingUser = await User.findOne({username})
  if (existingUser) {
    return res.status(400).render("register", {error: "Username is already taken"})
  }

  // Create a new user
  const newUser = new User({username, password, role: role || "staff"})

  // Save the user to the database
  await newUser.save()

  // Automatically log the user in after registration
  req.session.userId = newUser._id
  req.session.role = newUser.role

  res.redirect("/")
})

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/login")
})

module.exports = router
EOF

# Create models/Asset.js
cat > src/models/Asset.js <<EOF
const mongoose = require("mongoose")

const assetSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  location: {type: String, enum: ["Room", "General"], default: "General"},
  status: {type: String, enum: ["Working", "Needs Repair", "Replaced"], default: "Working"},
})

const Asset = mongoose.model("Asset", assetSchema)
module.exports = Asset
EOF

# Create models/User.js
cat > src/models/User.js <<EOF
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, enum: ["admin", "staff", "user"], default: "user"},
})

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", userSchema)
module.exports = User
EOF

# Create .gitignore
cat > .gitignore <<EOF
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
/lib-cov

# Coverage directory used by tools like istanbul
/coverage

# nyc test coverage
.nyc_output

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
/bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
/build/Release

# Dependency directories
/node_modules/
/jspm_packages/

# Typescript v1 declaration files
/typings/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# next.js build output
.next

/package-lock.json

/mongo-data
EOF
# Create package.json
cat > package.json <<EOF
{
  "name": "karimroy",
  "description": "This application using express js and mongoose by Karim Roy Tampubolon",
  "main": "index.js",
  "author": "karimroy",
  "license": "ISC",
  "scripts": {
    "dev": "nodemon ./src/index",
    "start": "node ./src/index",
    "mongo-start": "docker run -d -p 27017:27017 --name my-mongo -v mongo-data:/data/db mongo",
    "mongo-stop": "docker stop my-mongo",
    "mongo-remove": "docker rm -f my-mongo"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "connect-mongo": "^5.1.0",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "hbs": "^4.2.0",
    "joi": "^17.13.3",
    "method-override": "^3.0.0",
    "mongoose": "^8.5.2",
    "morgan": "~1.9.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.16"
  },
  "nodemonConfig": {
    "ext": "js,mjs,json,css,html,hbs"
  }
}
EOF

# Create .env
cat > .env <<EOF
# Prisma supports the native connection string format for PostgreSQL, MySQL,
# SQLite, SQL Server, MongoDB and CockroachDB (Preview).
# See the Prisma documentation for all the connection string
# options: https://pris.ly/d/connection-strings

# This DATABASE_URL string connects to a local MongoDB replica set.
# See README.md for instructions on running MongoDB locally in Docker.
# DATABASE_URL="mongodb+srv://papinos-main-db-07e5801c402:Fk5WnzRpQSZcd6gynrcZttdgM8fN8V@prod-us-central1-1.lfuy1.mongodb.net/papinos-main-db-07e5801c402"
DATABASE_URL="mongodb://localhost:27017/mydatabase"
SESSION_SECRET=karimroytampubolon
EOF

# Create src/views/layout.hbs
cat > src/views/layout.hbs <<EOF
<html lang="en">

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>TPM Total Productive Maintenance</title>
    <!-- Search Engine -->
    <meta name="description" content="Form TPM, PAVSE DIGITAL" />
    <meta name="image" content="../../assets/img/ico/android-chrome-192x192.png" />
    <!-- Schema.org for Google -->
    <meta itemprop="name" content="PAVSE DIGITAL" />
    <meta itemprop="description" content="Form TPM, PAVSE DIGITAL" />
    <meta itemprop="image" content="../../assets/img/ico/android-chrome-192x192.png" />
    <!-- Open Graph general (Facebook, Pinterest & LinkedIn) -->
    <meta property="og:title" content="PAVSE DIGITAL" />
    <meta property="og:description" content="Form TPM, PAVSE DIGITAL " />
    <meta property="og:image" content="../../assets/img/ico/android-chrome-192x192.png" />
    <meta property="og:url" content="../assets" />
    <meta property="og:site_name" content="PAVSE DIGITAL" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <!-- Twitter -->
    <meta property="twitter:card" content="summary" />
    <meta property="twitter:title" content="PAVSE DIGITAL" />
    <meta property="twitter:description" content="Form TPM, PAVSE DIGITAL" />
    <meta property="twitter:image:src" content="../../assets/img/ico/android-chrome-192x192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="../../assets/img/ico/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="../../assets/img/ico/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="../../assets/img/ico/favicon-16x16.png" />
    <link rel="manifest" href="../../assets/img/ico/site.webmanifest" />
    <link rel="icon" href="img/ico/favicon-32x32.png" type="image/x-icon" />
    <link rel="icon" href="../../assets/img/ico/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="../../assets/css/all.min.css" />
    <link rel="stylesheet" href="../../assets/css/core.min.css" />
    <link rel="stylesheet" href="../../assets/css/transfer.min.css" />
    <link rel="stylesheet" href="../../assets/css/background.min.css" />
  </head>

  <body style="background-color: #e8eaf6" class="" data-event-name="{{eventName}}">

    <main id="main-container" class="h-100">

      <!-- Background image -->
      <svg id="svg" viewBox="0 0 1440 390" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150 svg position-absolute d-none d-lg-block overflow-hidden w-100">
        <path
          d="M 0,400 C 0,400 0,133 0,133 C 83.54066985645932,134.22488038277513 167.08133971291863,135.44976076555025 264,142 C 360.91866028708137,148.55023923444975 471.2153110047848,160.42583732057417 571,144 C 670.7846889952152,127.57416267942583 760.0574162679425,82.84688995215312 856,86 C 951.9425837320575,89.15311004784688 1054.555023923445,140.18660287081337 1153,156 C 1251.444976076555,171.81339712918663 1345.7224880382773,152.4066985645933 1440,133 C 1440,133 1440,400 1440,400 Z"
          stroke="none"
          stroke-width="0"
          fill="#8ed1fc"
          fill-opacity="0.53"
          class="transition-all duration-300 ease-in-out delay-150 path-0"
          transform="rotate(-180 720 200)"
        ></path>

        <path
          d="M 0,400 C 0,400 0,266 0,266 C 89.69377990430621,265.82775119617224 179.38755980861242,265.6555023923445 275,266 C 370.6124401913876,266.3444976076555 472.1435406698564,267.2057416267943 583,274 C 693.8564593301436,280.7942583732057 814.0382775119618,293.5215311004784 908,299 C 1001.9617224880382,304.4784688995216 1069.7033492822966,302.7081339712919 1154,296 C 1238.2966507177034,289.2918660287081 1339.1483253588517,277.64593301435406 1440,266 C 1440,266 1440,400 1440,400 Z"
          stroke="none"
          stroke-width="0"
          fill="#8ed1fc"
          fill-opacity="1"
          class="transition-all duration-300 ease-in-out delay-150 path-1"
          transform="rotate(-180 720 200)"
        ></path>
      </svg>
      <!-- Background image -->
      {{#if sidebar}}
        <!--Main Navigation-->
        <header>
          <!-- Sidenav -->
          <nav id="sidenav" data-psa-sidenav-init class="sidenav sidenav-sm" data-psa-color="dark" data-psa-mode="side" data-psa-hidden="false" data-psa-scroll-container="#scrollContainer" data-psa-content="#content" data-psa-accordion="true">
            <div class="mt-4">
              <div id="header-content" class="ps-2">
                <div id="name" style="white-space: nowrap; text-transform: uppercase">{{firstName}}</div>
                <div class="small text-muted" id="nik" style="text-transform: uppercase">{{lastName}}</div>
                <div class="small text-muted" id="email">{{email}}</div>
              </div>
              <hr class="mb-0" />
            </div>
            <div id="scrollContainer">
              <ul class="sidenav-menu">
                <li class="sidenav-item">
                  <a class="sidenav-link" href="/dashboard"> <i class="fa-duotone fa-gauge fa-fw me-3"></i>Dashboard</a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link" href="/transfer"> <i class="fa-duotone fa-arrow-right-arrow-left fa-fw me-3"></i>Transfer</a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link" href="/Service"> <i class="fa-duotone fa-screwdriver-wrench fa-fw me-3"></i>Service</a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link" href="/asset"> <i class="fa-duotone fa-box fa-fw me-3"></i>Asset</a>
                </li>
              </ul>
              <hr class="m-0" />
              <ul class="sidenav-menu">
                <li class="sidenav-item">
                  <a class="sidenav-link" href="/user"> <i class="fa-duotone fa-user fa-fw me-3"></i>User Panel</a>
                </li>
                <li class="sidenav-item" id="button-signout">
                  <a href="/logout" class="sidenav-link"> <i class="fa-duotone fa-user-astronaut fa-fw me-3 pe-none"></i>Log out</a>
                </li>
              </ul>
            </div>
            <div class="text-center" style="height: 100px">
              <hr class="mb-4 mt-0" />
              <p class="small"> TPM Web App</p>
            </div>
          </nav>
          <!-- Sidenav -->

          <!-- Navbar -->
          <nav id="content" class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <!-- Container wrapper -->
            <div class="container-fluid">
              <!-- Toggle button -->
              <!-- Togglers -->
              <div id="toggler">
                <button data-psa-toggle="sidenav" data-psa-target="#sidenav" class="navbar-toggler d-lg-none" aria-controls="#sidenav" aria-haspopup="true">
                  <i class="fa-solid fa-bars"></i>
                </button>
                <button id="slim-toggler" class="navbar-toggler d-lg-block d-none">
                  <i class="fa-duotone fa-bars"></i>
                </button>
              </div>
              <!-- Togglers -->

              <!-- Brand -->
              <a class="navbar-brand" href="/dashboard">
                <!-- <img src="img/ico/favicon-32x32.png" height="25" alt="MDB Logo" loading="lazy" /> -->
                <div class="fw-bold"><span class="text-primary"></span> TPM - {{title}}</div>
              </a>

              <!-- Right links -->
              <ul class="navbar-nav ms-auto d-flex flex-row">
                <!-- Notification dropdown -->
                <li class="nav-item dropdown">
                  <a class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" href="#" id="navbarDropdownMenuLink" role="button" data-psa-toggle="dropdown" aria-expanded="false">
                    <i class="fa-duotone fa-bell"></i>
                    <span id="inbox-count" class=""></span>
                  </a>
                  <ul id="inbox-content" class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                    <li>
                      <a class="dropdown-item" href="#"></a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <!-- Container wrapper -->
          </nav>
          <!-- Navbar -->
        </header>
        <!--Main Navigation-->

        <!-- Main Body -->
        <main id="content" style="margin-top: 58px">
          <section class="container my-5 py-2">
            {{{body}}}
          </section>
        </main>
        <!-- Main Body -->
      {{else}}
        <!-- Main Body -->
        <main>
          <section class="container h-100">
            {{{body}}}
          </section>
        </main>
        <!-- Main Body -->
      {{/if}}

    </main>

  </body>

  <div class="modal fade" id="modalAlert" tabindex="-1" aria-labelledby="modalAlertLabel" aria-hidden="true">
    <div class="modal-dialog modal-side modal-top-right modal-sm">
      <div class="modal-content">
        <div class="modal-header p-2 bg-primary text-white">
          <h5 class="modal-title" id="modalAlertLabel"></h5>
          <button type="button" class="btn-close" data-psa-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-2" id="modalAlertBody"></div>
      </div>
    </div>
  </div>

  <div class="modal" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen" style="background: transparent">
      <div class="modal-content" style="background: transparent">
        <div class="modal-body d-flex justify-content-center align-items-center flex-column">
          <div class="spinner-border text-gray mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <small class="text-light" id="modal-content">Please wait...</small>
        </div>
      </div>
    </div>
  </div>

  <script type="text/javascript" src="../../assets/js/axios.min.js"></script>

  <script type="text/javascript" src="../../assets/js/core.min.js"></script>

  <script type="text/javascript" src="../../assets/js/module.min.js"></script>

  <script type="text/javascript" src="../../assets/js/index.js"></script>

</html>
EOF

cat > src/middlewares/handler.js <<EOF
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
  res.status(403).render("error", {message: "Access denied"})
}

const validate = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body)
  if (error) return res.status(400).render("error", {message: error.details[0].message})
  next()
}

module.exports = {authRouter, isAuthenticated, authorizeRole, validate}
EOF

yarn init -y

echo "Files created successfully!"
