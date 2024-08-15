// src/models/user.js

import { Schema, model } from "mongoose"
import { hash, compare } from "bcrypt"

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff", "user"], default: "user" },
})

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10)
  }
  next()
})

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return compare(candidatePassword, this.password)
}

const User = model("User", userSchema)
export default User
