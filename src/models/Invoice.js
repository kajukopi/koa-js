// src/models/invoice.js

import { Schema, model } from "mongoose"

const assetSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  location: { type: String, enum: ["Room", "General"], default: "General" },
  status: { type: String, enum: ["Working", "Needs Repair", "Replaced"], default: "Working" },
})

const Invoice = model("Invoice", assetSchema)

export default Invoice
