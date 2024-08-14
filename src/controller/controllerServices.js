import Service from "../models/Service.js";

export default {
    getAllServices: async (ctx) => {
        const services = await Service.find({});
        await ctx.render("services", { data: services, title: "Services" })
    },

    createService: async (ctx) => {
        const newService = new Service(ctx.request.body);
        await newService.save();
        await ctx.render("services", { data: newService, title: "Services" })
    },

    getServiceById: async (ctx) => {
        const service = await Service.findById(ctx.params.id);
        await ctx.render("services", { data:service, title: "Services" })
    },

    updateService: async (ctx) => {
        const updatedService = await Service.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("services", { data: updatedService, title: "Services" })
    },

    deleteService: async (ctx) => {
        await Service.findByIdAndDelete(ctx.params.id);
        await ctx.render("services", { data: "deleted", title: "Services" })
    },

}