import Service from "../models/Service.js";

export default {
    getAllServices: async (ctx) => {
        const services = await Service.find({});
        await ctx.render("services", { services })
    },

    createService: async (ctx) => {
        const newService = new Service(ctx.request.body);
        await newService.save();
        await ctx.render("services", { service: newService })
    },

    getServiceById: async (ctx) => {
        const service = await Service.findById(ctx.params.id);
        await ctx.render("services", { service })
    },

    updateService: async (ctx) => {
        const updatedService = await Service.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("services", { service: updatedService })
    },

    deleteService: async (ctx) => {
        await Service.findByIdAndDelete(ctx.params.id);
        await ctx.render("services", { service: "deleted" })
    },

}