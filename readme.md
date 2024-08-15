To create a guest house management system with a complete database setup without using JSON Web Tokens (JWT) for authentication, you can follow a more traditional approach, such as using session-based authentication or another form of token management. Here's a broad outline of how to set up such a system:

### 1. **Technology Stack**

- **Backend Framework**: Koa.js
- **Database**: MongoDB (using Mongoose)
- **Authentication**: Session-based authentication using `koa-session`
- **Templating Engine**: Handlebars (`koa-hbs-render`)
- **ORM/ODM**: Mongoose

### 2. **Database Schema Design**

You’ll need to design a set of Mongoose schemas for your database. The main entities could include:

- **Users**: Admins, staff, and possibly guests.
- **Rooms**: Information about the rooms in the guest house.
- **Reservations**: Booking details, associated with users and rooms.
- **Services**: Additional services offered by the guest house.
- **Invoices**: Billing details for services and stays.
- **Assets**: Any assets related to the guest house, like furniture, electronics, etc.

#### Example Schema

```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // Store hashed passwords
  role: { type: String, enum: ['admin', 'staff', 'guest'], default: 'guest' },
  email: String,
});

const RoomSchema = new mongoose.Schema({
  number: String,
  type: String,
  price: Number,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  checkInDate: Date,
  checkOutDate: Date,
  status: { type: String, enum: ['booked', 'checked-in', 'checked-out', 'cancelled'], default: 'booked' },
});

const ServiceSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const InvoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  totalAmount: Number,
  issuedDate: Date,
});

const AssetSchema = new mongoose.Schema({
  name: String,
  description: String,
  value: Number,
  location: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export const User = mongoose.model('User', UserSchema);
export const Room = mongoose.model('Room', RoomSchema);
export const Reservation = mongoose.model('Reservation', ReservationSchema);
export const Service = mongoose.model('Service', ServiceSchema);
export const Invoice = mongoose.model('Invoice', InvoiceSchema);
export const Asset = mongoose.model('Asset', AssetSchema);
```

### 3. **Session-Based Authentication**

For session-based authentication, you can use `koa-session` along with `koa-passport` for local strategy authentication.

#### Setup Session and Authentication

```javascript
import Koa from 'koa';
import session from 'koa-session';
import passport from 'koa-passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';
import { User } from './models'; // Assuming the User model is in models.js
import bcrypt from 'bcrypt';

const app = new Koa();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/guesthouse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Session configuration
app.keys = ['your-session-secret'];
app.use(session({}, app));

// Passport Local Strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });
  if (!user) return done(null, false, { message: 'Incorrect username.' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return done(null, false, { message: 'Incorrect password.' });

  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Initialize passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Sample login route
app.use(async (ctx) => {
  if (ctx.path === '/login' && ctx.method === 'POST') {
    return passport.authenticate('local', async (err, user, info) => {
      if (user) {
        await ctx.login(user);
        ctx.redirect('/');
      } else {
        ctx.status = 400;
        ctx.body = { message: info.message };
      }
    })(ctx);
  }
});

// Protect routes
app.use(async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next();
  } else {
    ctx.redirect('/login');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### 4. **Templating and Views**

Use `koa-hbs-render` to render views with Handlebars. Define default layouts and use partials for reusable components.

```javascript
import render from 'koa-hbs-render';
import path from 'path';

app.use(render({
  paths: path.join(__dirname, 'views'),
  layout: 'layouts/main',
  viewExt: 'hbs',
  cache: false,
  options: {
    partials: {
      header: 'partials/header',
    },
  },
}));
```

### 5. **Routes and Controllers**

Organize your routes and controllers to handle different functionalities like user management, room management, reservations, etc.

```javascript
// routes/users.js
import Router from 'koa-router';
import { User } from '../models';

const router = new Router();

router.get('/users', async (ctx) => {
  const users = await User.find({}, '').lean();
  await ctx.render('users/index', { users });
});

export default router;

// main app
import userRoutes from './routes/users';
app.use(userRoutes.routes());
```

### 6. **Running the Application**

Start your server and navigate to the corresponding routes to manage your guest house.

```bash
node src/app.js
```

### Summary

- **Session-Based Authentication**: Secure your app without JWT, using sessions.
- **Mongoose ODM**: Models for Users, Rooms, Reservations, Services, Invoices, and Assets.
- **Koa and Handlebars**: Use `koa-hbs-render` for templating with layouts and partials.
- **Organized Routes**: Split routes into different modules for better maintainability.

This setup gives you a robust foundation to build out a full-featured guest house management system with Koa.js.




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