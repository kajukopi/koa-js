// src/models/room.js

import { Schema, model } from "mongoose"

const roomSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  location: { type: String, enum: ["Room", "General"], default: "General" },
  status: { type: String, enum: ["Working", "Needs Repair", "Replaced"], default: "Working" },
})

const Room = model("Room", roomSchema)

export default Room
