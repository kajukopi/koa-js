// src/models/auth.js

import { Schema, model } from "mongoose"

const authSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  location: { type: String, enum: ["Room", "General"], default: "General" },
  status: { type: String, enum: ["Working", "Needs Repair", "Replaced"], default: "Working" },
})

const Auth = model("Auth", authSchema)

export default Auth
