import {Schema, model} from "mongoose"

const serviceSchema = new Schema({
  name: {type: String, required: true},
  description: String,
  location: {type: String, enum: ["Room", "General"], default: "General"},
  status: {type: String, enum: ["Working", "Needs Repair", "Replaced"], default: "Working"},
})

const Service = model("Service", serviceSchema)

export default Service
